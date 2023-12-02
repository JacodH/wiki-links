class Camera {
  init() {
    this.ui = undefined;
    
    this.x = width/2;
    this.y = height/2;
    
    this.halves = [width/2, height/2]
    
    this.mx = 0;
    this.my = 0;
    
    this.tween = undefined;
  }
  
  get cx() {
    return -this.x + this.halves[0];
  }
  get cy() {
    return -this.y + this.halves[1];
  }
  get ma() {
    return Math.atan2(this.my - this.cy, this.mx - this.cx)
  }
  
  goto(x = 0, y = 0, time = 250) {
    this.tween = new TWEEN.Tween(this);
    this.tween.to({x: -x + this.halves[0], y: -y + this.halves[1]}, time);
    this.tween.easing(TWEEN.Easing.Quadratic.InOut)
    return this.tween;
  }
  
  update() {
    translate(this.x, this.y);
    
    this.mx = -(this.x - mouseX);
    this.my = -(this.y - mouseY);
    
    if (this.ui != undefined) {
      // update UI
      
      // position
      this.ui.pos.val = `(${this.x.toFixed()}, ${this.y.toFixed()})`
      
      // mouse
      this.ui.mx.val = this.mx.toFixed();
      this.ui.my.val = this.my.toFixed();
      this.ui.ma.val = this.ma.toFixed(2);
    }
  }
  
  openUI() {
    if (this.ui != undefined) { return } // UI is already open
    
    this.ui = new Holder({
      name: "Camera",
      x: innerWidth-200-5,
      y: 5,
    })
                               
    this.ui.add(new Label({ name: "pos", val: `(${this.x}, ${this.y})` }))
                               
    this.ui.add(new Label({ name: "mx", val: 0 }));
    this.ui.add(new Label({ name: "my", val: 0 }));
    this.ui.add(new Label({ name: "ma", val: 0 }));
  }
}