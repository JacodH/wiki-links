console.log(`viz.js | under heavy development`)

function addBasicProperties(ele) {
  ele.hidden = false;
  ele.defualt_display_value = ele.ele.style.display;

  ele.toggle_display = function() {
      if (ele.hidden == true) {
        ele.ele.style.display = ele.defualt_display_value;
      }
      if (ele.hidden == false) {
        ele.ele.style.display = "none"
      }
      ele.hidden = !ele.hidden;
  }
  
  ele.hilight = function(duration = 1000, color = copyArray(ele.holder.config.accent)) {
      color[3] = 0.1;
      ele.ele.style.backgroundColor = `rgba(${color})`;
      setTimeout(() => {
        ele.ele.style.backgroundColor = ``;
      }, duration)
  }
  
  // hover effect
  if (['button', 'tfbutton'].includes(ele.config.type) == false) { // dont apply to these types
    ele.ele.addEventListener("mouseenter", (event) => {
      let color = copyArray(ele.holder.config.accent);
      color[3] = 0.1;
      ele.ele.style.backgroundColor = `rgba(${color})`;
    });
    ele.ele.addEventListener("mouseleave", (event) => {
      ele.ele.style.backgroundColor = ``;
    });
  }
  
  if (ele.config.type == "slider") {
    let color = copyArray(ele.holder.config.accent);
    color[3] = 0.75;
    ele.slider.style.setProperty('--SliderColor', `rgba(${color})`)
  }
  
  if (ele.config.type == "list") {
    ele.select.addEventListener("mouseenter", (event) => {
      let color = copyArray(ele.holder.config.accent);
      color[3] = 0.5;
      ele.select.style.backgroundColor = `rgba(${color})`;
    });
    ele.select.addEventListener("mouseleave", (event) => {
      ele.select.style.backgroundColor = ``;
    });
  }
  if (ele.config.type == "label") {
    ele.elementRight.addEventListener("focus", (event) => {
      let color = copyArray(ele.holder.config.accent);
      color[3] = 0.75;
      ele.elementRight.style.borderColor = `rgba(${color})`;
    });
    ele.elementRight.addEventListener("focusout", (event) => {
      ele.elementRight.style.borderColor = ``;
    });
  }
  
  ele.delete = function() {
    ele.ele.remove();
    ele.holder[ele.name] = undefined;
  }
  
  ele.getValCall = function() {
    if (ele.config.flags.includes("making") == false && ele.config.flags.includes("maker_list") == false) {
      return `viz["${ele.holder.config.name}"]["${ele.name}"].val`
    }
    return ""
  }

  // for viz grapher bundle
  ele.ele.addEventListener('click', () => {
    if (viz.grapher != undefined) {
      if (viz.grapher.selecting.val == true && ele.holder.config.name != 'grapher') {
        
        // this is now getting graphed
        viz.graphSelect(ele);
      }
    }
  })
  
  ele.ele.classList.add("basic_4");
  
  return ele;
}

animate();

function animate() {
	requestAnimationFrame(animate);
	TWEEN.update();
}

class Holder {
    constructor(config = {}) {
        this.config = setConfig(configs.holder, config);

        viz[this.config.name] = this;
        viz.tabs += 1;
      
        this.ele = document.createElement('div'); // create body ele

        this.ele.addEventListener('mouseenter', () => { viz.overTab = true;  });
        this.ele.addEventListener('mouseleave', () => { viz.overTab = false; });

        this.ele.className = 'tab_holder'
        this.ele.id = `tab_${viz.tabs}`

        // set styles
        this.ele.style.zIndex = this.config.z_index;
        this.ele.style.backgroundColor = `rgba(${this.config.background_color})`;
        this.ele.style.borderRadius = this.config.borderRadius+"px";
      
        if (typeof this.config.width == "number") {
    		this.ele.style.width = this.config.width-(viz.padding*2) + "px";
        }else {
    		this.ele.style.width = this.config.width;
        }
        if (typeof this.config.height == "number") {
    		this.ele.style.height = this.config.height-(viz.padding*2) + "px";
        }else {
    		this.ele.style.height = this.config.height;
        }

        if (this.config.static == false) {
			// create mover / name
			this.mover = document.createElement('div');
			this.mover.className = 'tab_mover';
			this.mover.innerHTML = this.config.name
			
			// mover style
			this.mover.style.borderRadius = (this.config.borderRadius)+"px";
            this.mover.style.backgroundColor = `rgba(${this.config.accent})`;
          
			
			this.ele.append(this.mover);
			this.x = this.config.x;
			this.y = this.config.y;

			this.sx = 0;
			this.sy = 0;

			this.mover.onmousedown = (e) => {

                this.sx = e.clientX;
                this.sy = e.clientY;

                this.mover.onmousemove = (e) => {
                    e.preventDefault();

                    let pos1 = this.sx - e.clientX;
                    let pos2 = this.sy - e.clientY;

                    this.sx = e.clientX;
                    this.sy = e.clientY;

                    this.ele.style.left = (this.ele.offsetLeft - pos1)+"px";
                    this.ele.style.top = (this.ele.offsetTop - pos2)+"px";

                    this.x = (this.ele.offsetLeft - pos1);
                    this.y = (this.ele.offsetTop - pos2);
                }

                this.mover.onmouseup = (e) => {
                    this.mover.onmousemove = () => {}
                }
            }
        }

        this.elements = [];
        document.body.append(this.ele);
      
        // init slide anitmation
        if (this.config.slideIn == true) {
          this.move(this.config.ix, this.config.iy);
          this.slide(this.config.x, this.config.y, 500);
        }
    }

    add(ele) {
		this[ele.name] = ele;
		this[ele.name].holder = this;
      
        ele = addBasicProperties(ele);
        
		this.ele.append(ele.ele);
		if (ele instanceof Display) {
			setTimeout(() => {
				ele.resize(this.config.width-(viz.padding*2), ele.config.height)
				ele.run();
			}, 100)
		}
      
        this.elements.push(ele);
	}
  
    getFlagged(flag) {
      let out = [];
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].config.flags.indexOf(flag) != -1) {
          out.push(this.elements[i]);
        }
      }
      return out
    }

	move(x, y) {
        this.x = x;
        this.y = y;
		this.ele.style.left = x+"px";
		this.ele.style.top = y+"px";
	}
  
    slide(x, y, time = 750) {
      var holder = this;
      
      var tween = new TWEEN.Tween({left: this.x, top: this.y})

      // Then tell the tween we want to animate the x property over 1000 milliseconds
      tween.to({left: x, top: y}, time);
      tween.easing(TWEEN.Easing.Quadratic.InOut)
      tween.start()
      
      tween.onUpdate(function (t) {
          holder.move(t.left, t.top);
      })
	}
  
  	hilight(duration = 0.75, color = copyArray(this.config.accent)) {
        color[3] = 0.1;
		this.ele.style.backgroundColor = `rgba(${color})`;
		setTimeout(() => {
			this.ele.style.backgroundColor = `rgba(${this.config.background_color})`;
		}, duration*1000)
	}

	get width() {
		return parseFloat(this.ele.offsetWidth);
	}
	get height() {
		return parseFloat(this.ele.offsetHeight);
	}
  
    get right() {
      return (this.x + this.width)
    }
  
    get left() {
      return (this.x);
    }
  
    get top() {
      return (this.y)
    }
  
    get bottom() {
      return (this.y + this.height)
    }
  
    get cx() {
      return this.x + (this.width/2);
    }
    get cy() {
      return this.y + (this.height/2);
    }
  
    close() {
      this.ele.remove();
      viz[this.config.name] = undefined;
    }
}
viz.elements.holder = Holder;
class Label {
    constructor(config = {}) {
        this.config = setConfig(configs.label, config);

		this.name = this.config.name;
        
        this.ele = document.createElement('div');
      	this.ele.classList.add("container")
  
		this.elementLeft = document.createElement('span');
		this.elementLeft.className = 'label_left'
		this.elementLeft.innerText = this.config.name;

		let dev = document.createElement('hr');
		dev.classList.add("dev");

		this.ele.append(this.elementLeft);
		this.ele.append(dev);
		
		this.elementRight = document.createElement('input');
        this.elementRight.setAttribute("type", "text");
		this.elementRight.className = 'label_right';
      
		this.val = this.config.val;
        this.value = this.config.val;
      
        this.elementLeft.title = this.config.tooltip;

        this.elementRight.style.width = (this.elementRight.value.length * 8)+"px";        

		this.ele.append(this.elementRight);
      
        this.elementRight.addEventListener("input", (e) => {
          let value = this.elementRight.value;
          
          this.elementRight.style.width = (this.elementRight.value.length * 8)+"px";        
		  this.elementRight.style.setProperty("color", viz.type_colors[this.type]);
          
          this.config.onChange(value);
        })
	}

    get type() {
      if(this.val == "true" || this.val == "false") {
        return "boolean"
      }
      if (isNaN(parseFloat(this.val))) {
        return "string"
      }
      return "number"
    }
  
	set val(val) {
		this.elementRight.value = val + "" + this.config.unit;
		this.elementRight.style.setProperty("color", viz.type_colors[this.type]);
        this.elementRight.style.width = (this.elementRight.value.length * 8)+"px";        
      
	}
  
    get val() {
      let val = this.elementRight.value;
      
      if(val == "true" || val == "false") {
        return parseBoolean(val);
      }
      if (isNaN(parseFloat(val))) {
        return val
      }
      return parseFloat(val);
    }
  
}
viz.elements.label = Label;
class Slider {
	constructor(config = {}) {
		this.config = setConfig(configs.slider, config);

		this.name = this.config.name;
		this.data = undefined;

		this.slider = document.createElement('input');
		this.slider.type = "range";
		this.slider.min = this.config.min;
		this.slider.max = this.config.max;
		this.slider.step = this.config.step;
		this.slider.value = this.config.data;
		this.slider.classList.add("slider");

		let div = document.createElement('div');
		div.classList.add("container")

		let label = document.createElement('span');
		label.innerText = this.name;
		label.classList.add('label_left')
		label.classList.add('slider_label')

        label.onclick = () => {
          this.toggle_slider();
        }
        
		let dev = document.createElement('hr');
		dev.classList.add("dev");

		this.elementRight = document.createElement('span');
		this.elementRight.className = 'label_right'
		this.elementRight.innerText = this.config.val.toFixed(countDecimal(this.config.val));
		this.elementRight.style.setProperty("color", viz.type_colors[typeof this.config.val])

		div.append(label, dev, this.elementRight);

		this.slider.addEventListener("input", () => {
			this.data = clamp(this.slider.value, this.config.min, this.config.max);
			this.elementRight.innerText = parseFloat(this.data).toFixed(this.config.fix)
			this.config.onChange(this.data);
		})

		this.ele = document.createElement('div');
		this.ele.classList.add("slidecontainer")
		this.ele.append(div, this.slider);
      
        this.val = this.config.val;
        this.data = this.config.val;
      
        this.showing_slider = true;
        this.finished_loading = true;
	}

	set val(newVal) {
		if (this.data == newVal && this.finished_loading == true) { return }
	
		this.data = clamp(newVal, this.min, this.max);
		this.slider.value = this.data.toString();
		this.elementRight.innerText = this.data.toFixed(this.config.fix)
	}

	get val() {
		return parseFloat(this.data);
	}
      
    toggle_slider() {
      this.showing_slider = !this.showing_slider;
      if (this.showing_slider == true) {
        this.slider.style.display = "inline-block"
      }else {
        this.slider.style.display = "none"
      }
    }
}
viz.elements.slider = Slider;
class Br {
      constructor(config = {}) {
		this.config = setConfig(configs.br, config);
        this.name = "Br"
		this.ele = document.createElement("br")
	}
}
viz.elements.br = Br;
class Button {
	constructor(config = {}) {
		this.config = setConfig(configs.button, config);

		this.name = this.config.name;
		this.onPress = this.config.onPress;

		this.ele = document.createElement('button');
		this.ele.onclick = this.onPress;
		this.ele.innerText = this.name;
		this.ele.className = 'node_button'
        
      
        this.ele.addEventListener("mouseenter", (event) => {
          let color = copyArray(this.holder.config.accent);
          color[3] = 0.75;
          this.ele.style.backgroundColor = `rgba(${color})`;
        });
        this.ele.addEventListener("mouseleave", (event) => {
          this.ele.style.backgroundColor = ``;
        });
	}
}
viz.elements.button = Button;
class Display {
	constructor(config = {}) {
        this.config = setConfig(configs.display, config);

		this.name = this.config.name;

		this.paused = false;
		this.closed = false;
        this.deltaTime = 1; // time between frames
        this._timeAfter = Date.now();
		this.frame = 0;

		this.ele = document.createElement('div');
		let sketch = function(p) {
			p.setup = function() {
				p.createCanvas(200, 200);
				p.background(234, 234, 234);
			}
		};

		this.p5 = new p5(sketch, this.ele);
	}

	run() {
		requestAnimationFrame(() => {
            let currentTime = Date.now();
          
            this.deltaTime = (currentTime - this._timeAfter) / 1000;
			if (this.closed == true) {
				return
			}

			if (this.paused == true) {
				this.run();
				return;
			}

			this.config.update(this);
			this.frame += 1;

            this._timeAfter = currentTime;
			this.run();
		})
	}

	close() {
		this.closed = true;
	}

	pause() {
		this.paused = true;
	}

	unpause() {
		this.paused = false;
	}

	togglePause() {
		this.paused = !this.paused;
	}

	resize(w = this.config.width, h = this.config.height) {
		this.config.width = w;
		this.config.height = h;
		this.p5.resizeCanvas(w, h);
	}
}
viz.elements.display = Display;
class TFButton {
	constructor(config = {}) {
		this.config = setConfig(configs.tfbutton, config);

		this.name = this.config.name;
        this.data = this.config.val;
		this.onPress = this.config.onPress;

		this.ele = document.createElement('button');
        this.ele.onclick = () => {
          this.toggle();
          this.onPress(this.data);
        };
		this.ele.className = 'node_button'
      
        this.toggle();
        this.toggle();
      
        this.ele.addEventListener("mouseenter", (event) => {
          let color = copyArray(this.holder.config.accent);
          color[3] = 0.75;
          this.ele.style.backgroundColor = `rgba(${color})`;
        });
        this.ele.addEventListener("mouseleave", (event) => {
          this.ele.style.backgroundColor = ``;
        });
	}
  
    get val() {
      return this.data;
    }
  
    set val(data) {
      if (this.data != data) {
        this.toggle();
      }
    }
  
    toggle() {
      this.data = !this.data;
      
      let color = 'nothin';
      let text = 'notin';
      
      
      if (this.data == true) {
        color = "green";
        text = this.config.true;
        
      }else {
        color = "red";
        text = this.config.false;
      }
      
      
      
      this.ele.innerHTML = `${this.name}: <b style="color: ${color}">${text}</b>`;
    }
}
viz.elements.tfbutton = TFButton;
class List {
	constructor(config = {}) {
		this.config = setConfig(configs.list, config);

		this.name = this.config.name;
        this.options = this.config.options;
      
        this.value = this.config.value;

        this.ele = document.createElement('div');
      	this.ele.classList.add("container")
  
		this.elementLeft = document.createElement('span');
		this.elementLeft.className = 'label_left'
		this.elementLeft.innerText = this.config.name;

		let dev = document.createElement('hr');
		dev.classList.add("dev");

		this.ele.append(this.elementLeft);
		this.ele.append(dev);
      
        this.select = document.createElement('select')
        for (let i = 0; i < this.options.length; i++) {
          let opt = document.createElement('option');
          opt.value = this.options[i];
          opt.innerHTML = this.options[i];
          this.select.append(opt)
        }
        this.select.classList.add("list")
      
        this.select.onchange = (e) => {
          this.value = this.select.value;
          this.config.onChange(this.value);
        }
      
        this.ele.append(this.select)
	}
    get val() {
      return this.value;
    }
    set val(val) {
      let opts = Array.from(this.select.options);
      
      for (let i = 0; i < opts.length; i++) {
        if (opts[i].value == val) {
          opts[i].selected = true;
          return true;
        }
      }
      
      return console.error(`VIZ error, you tried to select '${val}' as the new value for list elt '${this.name}'. This option is not appart of the options list: [${this.options.join(", ")}]`)
    }
    get index() {
      let opts = Array.from(this.select.options);
      
      for (let i = 0; i < opts.length; i++) {
        console.log(opts[i].value, this.value, i)
        if (opts[i].value == this.value) {
          opts[i].selected = true;
          return i;
        }
      }
    }
}
viz.elements.list = List;
class ColorPicker {
	constructor(config = {}) {
		this.config = setConfig(configs.colorPicker, config);

		this.name = this.config.name;
        this.options = this.config.options;
      
        this.value = this.config.value;

        this.ele = document.createElement('div');
      	this.ele.classList.add("container")
  
		this.elementLeft = document.createElement('span');
		this.elementLeft.className = 'label_left'
		this.elementLeft.innerText = this.config.name;

		let dev = document.createElement('hr');
		dev.classList.add("dev");

		this.ele.append(this.elementLeft);
		this.ele.append(dev);
      
        this.color_elt = document.createElement('input');
        this.color_elt.type = "color"
        this.color_elt.classList.add("colorPicker")
        this.color_elt.onchange = (e) => {
          this.value = this.color_elt.value;
          this.config.onChange(this.value);
        }
      
        this.ele.append(this.color_elt)
	}
    get val() {
      return this.value;
    }
    set val(val) {
      this.value = val;
      this.color_elt.value = val;
    }
}
viz.elements.list = ColorPicker;


class Folder {
  constructor(config) {
    this.config = setConfig(configs.folder, config);

    this.name = this.config.name;
    
    this.ele = document.createElement('div');
    this.ele.className = 'folder';

    this.elementLeft = document.createElement('span');
    this.elementLeft.className = 'label_left'
    this.elementLeft.innerText = this.config.name;

    let dev = document.createElement('hr');
    dev.classList.add("dev");

    this.ele.append(this.elementLeft);
    this.ele.append(dev);
    
    
  }

  collapse() {
    
  }

  add(ele) {
    this[ele.name] = ele;
    this.items.push(ele.name);
    this.ele.append(ele.ele);
  }

  clear() {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      this[item].ele.remove()
      this.items.splice(i, 1);
      i--;
    }
  }
}