// var links = [];

function calcLinkVolume(max_range, n /* number of links*/) {
  return LINK_DIST * 0.9 * (max_range / n);
}

class Link {
  constructor(name, art) {
    this.name = name; // name of linked article
    
    this.art = art; // parent article
    
    this.i = this.art.links.length; // index of link in art.link array
    
    this.li = this.i - 1;
    this.ri = this.i + 1;
    
    if (this.li < 0) {
      this.li = this.art.n-1;
    }
    
    if (this.ri > this.art.n-1) {
      this.ri = 0;
    }
    
    this.a = 0;
    
    this.x = art.x;
    this.y = art.y;
    
    this.ani = {
      len: -200,
      vol: 0,
      a: 0,
      mouse_in: false,
    }
    
    this.volume = calcLinkVolume(this.art.max_range, this.art.n)
    
    this.calcAngle();
    this.calcPosition();
    
    // links.push(this);
  }
  
  calcAngle() {
    // dev range = [0, 1, 4, Math.PI*2]
    
    this.da = this.art.max_range / this.art.n;
    // da is the angle between each link (radian per link)

    let a = this.da * this.i; // this angle
    
    for (let i = 0; i < this.art.range.length; i+=2) {
      
      let min = this.art.range[i];
      let max = this.art.range[i+1];
      let len = max-min;
      
      if (a < min) {
        a += min;
      }
    }
    
    this.a = a;
    
  }
  
  get len() {
    return LINK_DIST + this.ani.len;
  }
  
  get vol() {
    return this.volume + this.ani.vol;
  }
  
  calcPosition() {
    this.x = cos(this.a + this.ani.a) * this.len;
    this.y = sin(this.a + this.ani.a) * this.len;
    
    this.x += this.art.x;
    this.y += this.art.y;
  }
  
  hoverCheck() {
    if (pythagorean(cam.mx, cam.my, this.x, this.y) < this.volume / 2) {
      // mouse is inside
      if (this.ani.mouse_in == false) {
        this.ani.mouse_in = true;
        
        this.hoverIn();
      }
    }else {
      if (this.ani.mouse_in == true) {
        this.ani.mouse_in = false;
        
        this.hoverOut();
      }
    }
  }
  
  hoverIn() {
    // mouse entered
    let tween = new TWEEN.Tween(this.ani);
    tween.easing(ANI_FUNCTION)
    tween.to({ vol: this.volume*1.2 }, ART_HOVER_TIME);
    tween.start();
    
    let ri = new TWEEN.Tween(this.art.links[this.ri].ani);
    ri.easing(ANI_FUNCTION)
    ri.to({ a: this.da/2 }, ART_HOVER_TIME);
    ri.start();
    
    let li = new TWEEN.Tween(this.art.links[this.li].ani);
    li.easing(ANI_FUNCTION)
    li.to({ a: -this.da/2 }, ART_HOVER_TIME);
    li.start();
  }
  
  hoverOut() {
    // mouse left
    let tween = new TWEEN.Tween(this.ani);
    tween.easing(ANI_FUNCTION)
    tween.to({ vol: 0 }, ART_HOVER_TIME);
    tween.start();
    
    
    let ri = new TWEEN.Tween(this.art.links[this.ri].ani);
    ri.easing(ANI_FUNCTION)
    ri.to({ a: 0 }, ART_HOVER_TIME);
    ri.start();
    
    let li = new TWEEN.Tween(this.art.links[this.li].ani);
    li.easing(ANI_FUNCTION)
    li.to({ a: 0 }, ART_HOVER_TIME);
    li.start();
  }
  
  render() {
    
    this.calcPosition()
    
    this.hoverCheck();

    stroke(0, 0, 0, 255);
    line(this.x, this.y, this.art.x, this.art.y);
    
    fill(255, 255, 255, 255);
    ellipse(this.x, this.y, this.vol);

    stroke(0, 0, 0, 0);
    fill(0, 0, 0, 255);
    textSize(this.vol * 2 / this.name.length)
    text(this.name, this.x, this.y);
    
    // fill(0, 0, 0, 200);
    // textSize(this.vol / this.disc.length)
    // text(this.disc, this.x, this.y + (this.vol * 0.1));
    
  }
  
  index() {
    for (let i = 0; i < this.art.links.length; i++) {
      let link = this.art.links[i];
      if (link.name == this.name) {
        return i;
      }
    }
  }
}