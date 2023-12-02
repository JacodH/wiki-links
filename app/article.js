var articles = [];

function getSelected() {
  for (let i = 0; i < articles.length; i++) {
    let art = articles[i];
    if (art.selected == true) {
      return art;
    }
  }
}

class Article {
  constructor(name = "Tetris", ix = 0, iy = 0, fx = 0, fy = 0) {
    this.x = ix;
    this.y = iy;
    
    this.fx = fx;
    this.fy = fy;
    
    this.name = name;
    this.disc = "loading..."
    this.n = Math.round(LINK_DIST * 0.9 * 2 * Math.PI / LINK_VOl); // number of links
    this.links = [];
    this.links_loaded = false;
    this.links_loaded_index = 0;
    this.volume = ART_VOLUME;
    
    for (let i = 0; i < articles.length; i++) {
      articles[i].selected = false;
    }
    
    this.selected = true;

    this.calcRange();
    
    this.ani = { // values for animating
      mouse_in: false,
      color: [255, 255, 255, 255],
      added_volume: 0,
      load_arc_end: 0,
      pages_alpha: 200,
      left_bracket: 0,
      hover_left_bracket: false,
      right_bracket: 0,
      hover_right_bracket: false,
    }
    
    this.load();
    
    articles.push(this);
  }
  
  calcRange() {
    this.range = [0, Math.PI*2];
    this.max_range = 0;
    
    for (let i = 0; i < this.range.length; i+=2) {
      let min = this.range[i];
      let max = this.range[i+1];
      
      let length = max - min;
      
      this.max_range += length;
    }
  }
  
  async load() {
    this.tween = new TWEEN.Tween(this);
    this.tween.to({x: this.fx, y: this.fy}, PULL_OUT_TIME);
    this.tween.start(); // slide the aritcle out while loading data
    
    let data = await getPage(this.name);
    this.data = data.parse;

    this.mass = this.data.text['*'].length;
    this.raw_links = parseLinks(this.data.links);

    this.disc = this.data.properties[0]['*'];
    
    this.loaded = true;
    
    this.links = [];
    this.loadLinks();
  }

  loadLinks(starting_index = 0) {
    this.links = [];
    
    let da = this.max_range / this.n;
    
    let i = starting_index;
    
    while (this.links.length < this.n) {
      if (i > this.raw_links.length-1) {
        i = 0;
      }
      
      let link = this.raw_links[i];
      
      this.links.push(new Link(link.name, this));
      
      i++;
    }
    
    for (let i = 0; i < this.links.length; i++) {
      let tween = new TWEEN.Tween(this.links[i].ani);
      tween.easing(ANI_FUNCTION);
      tween.to({ len: 0 }, 200);
      tween.delay(i * 15);
      tween.start();
    }
    
    this.links_loaded = true;
  }
  
  unloadLinks(done) {
    for (let i = 0; i < this.links.length; i++) {
      let tween = new TWEEN.Tween(this.links[i].ani);
      tween.easing(ANI_FUNCTION);
      tween.to({ len: -LINK_DIST }, 100);
      tween.delay(i * 15);
      tween.start();
    }
    
    setTimeout(done, (15 * this.links.length) + 75);
  }
  
  cycleNextLinks() {
    this.unloadLinks(() => {
      this.links_loaded_index += this.n;
      if (this.links_loaded_index > this.raw_links.length) {
        this.links_loaded_index -= this.n;
      }
      this.loadLinks(this.links_loaded_index)
    })
  }
  
  cyclePastLinks() {
    this.unloadLinks(() => {
      this.links_loaded_index -= this.n;
      if (this.links_loaded_index < 0) {
        this.links_loaded_index = 0;
      }
      this.loadLinks(this.links_loaded_index)
    })
  }
  
  get vol() {
    return this.volume + this.ani.added_volume;
  }
  
  hoverCheck() {
    if (pythagorean(cam.mx, cam.my, this.x, this.y) < this.vol / 2) {
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
    
    // check for brackets
    if (pythagorean(cam.mx, cam.my, this.x, this.y) < this.vol / 2) {
      if (-Math.PI/4 < cam.ma && cam.ma < Math.PI/4) {
        if (this.ani.hover_right_bracket == false) {
          this.ani.hover_right_bracket = true;

          this.hoverInRightBracket();
        }
      }else {
        if (this.ani.hover_right_bracket == true) {
          this.ani.hover_right_bracket = false;

          this.hoverOutRightBracket();
        }
      }

      let ma = Math.atan2(cam.my - cam.cy, cam.mx - cam.cx);
      if (ma < 0) { ma += Math.PI*2 }

      if ((-Math.PI/4) + Math.PI < ma && ma < (Math.PI/4) + Math.PI) {
        if (this.ani.hover_left_bracket == false) {
          this.ani.hover_left_bracket = true;

          this.hoverInLeftBracket();
        }
      }else {
        if (this.ani.hover_left_bracket == true) {
          this.ani.hover_left_bracket = false;

          this.hoverOutLeftBracket();
        }
      }
    }else {
      if (this.ani.hover_right_bracket == true) {
        this.ani.hover_right_bracket = false;

        this.hoverOutRightBracket();
      }
      if (this.ani.hover_left_bracket == true) {
        this.ani.hover_left_bracket = false;

        this.hoverOutLeftBracket();
      }
    }
    
  }
  
  hoverInLeftBracket() {
    let tween = new TWEEN.Tween(this.ani);
    tween.easing(ANI_FUNCTION)
    tween.to({left_bracket: 50 }, ART_HOVER_TIME);
    tween.start();
  }
  
  hoverOutLeftBracket() {
    let tween = new TWEEN.Tween(this.ani);
    tween.easing(ANI_FUNCTION)
    tween.to({left_bracket: 0 }, ART_HOVER_TIME);
    tween.start();
  }
  
  hoverInRightBracket() {
    let tween = new TWEEN.Tween(this.ani);
    tween.easing(ANI_FUNCTION)
    tween.to({right_bracket: 50 }, ART_HOVER_TIME);
    tween.start();
  }
  
  hoverOutRightBracket() {
    let tween = new TWEEN.Tween(this.ani);
    tween.easing(ANI_FUNCTION)
    tween.to({right_bracket: 0 }, ART_HOVER_TIME);
    tween.start();
  }
  
  hoverIn() {
    return
    // mouse entered
    let tween = new TWEEN.Tween(this.ani);
    tween.easing(ANI_FUNCTION)
    tween.to({added_volume: ART_HOVER_EXPAND }, ART_HOVER_TIME);
    tween.start();
  }
  
  hoverOut() {
    return
    // mouse left
    let tween = new TWEEN.Tween(this.ani);
    tween.easing(ANI_FUNCTION)
    tween.to({added_volume: 0 }, ART_HOVER_TIME);
    tween.start();
  }
  
  linkLoadAni() {
    let links = this.links.length; 
    
    
    // percentage of links loaded
    let percent = links/this.n;
    
    fill(255, 255, 255, 0);
    arc(this.x, this.y, this.vol+10, this.vol+10, 0, this.ani.load_arc_end);
    
    let tween = new TWEEN.Tween(this.ani);
    tween.easing(TWEEN.Easing.Quadratic.In);
    tween.to({
      load_arc_end: PI*2*percent,
    }, 50);
    tween.start();
  }
  
  render() {
    this.hoverCheck(); // hover size animation
    
    if (this.links_loaded == false) {
      this.linkLoadAni();
    }else {
      this.showLinks();
    }

    stroke(0, 0, 0, 255);
    fill(this.ani.color);
    ellipse(this.x, this.y, this.vol);
    
    stroke(0, 0, 0, 0);
    fill(0, 0, 0, 255);
    textSize(this.vol * 1.6 / this.name.length)
    text(this.name, this.x, this.y);
    
    fill(0, 0, 0, 200);
    textSize(this.vol * 1.6 / this.disc.length)
    text(this.disc, this.x, this.y + (this.vol * 0.1));
  
    
    if (this.links_loaded == true) { 
      let page = this.links_loaded_index / this.raw_links.length;
      page *= this.raw_links.length / this.n
      let count = `${page}/${Math.ceil(this.raw_links.length / this.n)}`;
      

      fill(0, 0, 0, 200);
      textSize(this.vol * 1.6 / this.disc.length)
      text(count, this.x, this.y + (this.vol/2) - 5);
      
      
      fill(0, 0, 0, 0);
      stroke(0, 0, 0, 255);
      arc(this.x, this.y, this.vol+this.ani.right_bracket-30, this.vol+this.ani.right_bracket-30, -Math.PI/4, Math.PI/4);
      arc(this.x, this.y, this.vol+this.ani.left_bracket-30, this.vol+this.ani.left_bracket-30, (-Math.PI/4) + Math.PI, (Math.PI/4)  + Math.PI);
    }
  }
  
  showLinks() {
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].render();
    }
  }
  
  renderLinks() {
    var rendered = 0;
    
    for (let i = 0; i < this.range.length; i += 2) {
      let min = this.range[i];
      let max = this.range[i+1];
      
      let length = max - min;
      
      let percent = length/this.max_range; // percentage of radius this arc takes up
      
      var rendering = Math.round(this.links.length * percent); // number of links rendering in this range
      
      // console.log([min, max], percent, rendering, this.links.length)

      // fill(255, 255, 255, 0);
      // arc(this.x, this.y, this.vol+20, this.vol+20, min, max);
      
      let da = length/rendering;
      
      for (let l = rendered; l < rendered+rendering; l++) {
        let index = l;
        let link = this.links[index];
        
        if (link == undefined) { continue }
        
        let a = da * l;
        
        var len = 0;
        var size = 100;

        
        let mv = createVector(cam.mx - cam.cx, cam.my - cam.cy);
        let md = pythagorean(cam.cx, cam.cy, cam.mx, cam.my);
        // mv.normalize();
        
        let lv = createVector(cos(a), sin(a));
        lv.normalize();
        
        let ad = mv.angleBetween(lv);
        
        len += 100;

        size = (len * 4 * PI) / this.links.length;

        if (abs(ad) > da) {
          a += clamp(ad, -da, da);
        }else {
          a -= clamp(ad, -da, da);

          size *= 3;
          len += 25;
        }
                                
        let x = cos(a);
        let y = sin(a);
        
        x *= (this.vol/2) + len;
        y *= (this.vol/2) + len;
        
        line(this.x, this.y, this.x+x, this.y+y)
        
        fill(255, 255, 255, 255);
        ellipse(x, y, size);
        
        fill(0, 0, 0, 255);
        textSize(size * 2 / link.name.length)
        text(link.name, x+this.x, y+this.y);
      }
      
      rendered += rendering;
    }
  }
}