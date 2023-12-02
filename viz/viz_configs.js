function setConfig(base_config, input) {
    let keys = Object.keys(base_config);

    let out = {};

    for (let i = 0; i < keys.length; i++) {
        if (input[keys[i]] != undefined) {
            out[keys[i]] = input[keys[i]];
        }else {
            out[keys[i]] = base_config[keys[i]]
        }
    }

    return out;
}

const type_colors = {
	"number": "rgba(0, 100, 255)",
	"string": "rgb(13, 147, 96)",
	"boolean": "rgb(177, 99, 216)"
}

const configs = {
    holder: {
        name: "Unnamed Tab",
        static: false,
        closeable: true,
      
        x: 0,
        y: 0,
      
        ix: [0, 0, -innerWidth, innerWidth][Math.round(rng(0, 4))],
        iy: [-innerHeight, innerHeight, 0, 0][Math.round(rng(0, 4))],

        // styles
        accent: [25, 50, 222],
        background_color: [224, 224, 224, 0.5],
        borderRadius: 10,
		width: 200,
        height: "auto",
        z_index: 100,
        slideIn: true,
      
        // flags
        flags: [],
    },
  	display: {
		name: "Display",
		width: 200,
		height: 200,
		update: (d) => {
            d.p5.clear();
			let f = d.frame;
			let x = Math.cos(f/60) * ((d.p5.width-30)/2);
			let y = Math.sin(f/60) * ((d.p5.height-30)/2);
          
			d.p5.stroke(0, 0, 0, 0);
			d.p5.fill(25, 50, 222);
			d.p5.ellipse(x+d.p5.width/2, y+d.p5.height/2, 30)
		},

		// styles
		borderRadius: 25,
          
        // flags
        flags: [],
	},
    label: {
        name: "Label",
        val: "Empty",
        unit: "",
        digits: 2,
        tooltip: "",
      
        onChange: (val) => {},

        // flags
        flags: [],
    },
	slider: {
		name: "Slider",
		min: 0,
		max: 1,
		val: 0.25,
		step: 0.01,
		fix: 2,
		onChange: (val) => {},
        // flags
        flags: [],
	},
	button: {
		name: "Button",
		onPress: () => {},
        // flags
        flags: [],
	},
    tfbutton: {
        val: true,
		name: "TF Button",
		onPress: () => {},
        true: "true",
        false: "false",
        
        // flags
        flags: [],
	},
    list: {
      name: "List",
      options: [
        "Big Mac",
        "Chicken fingers",
        "Breakfast on a bun",
        "This was all made by Jacob!"
      ],
      value: "Chicken fingers",
      onChange: (value) => {
        console.log("val of list changed to '"+value+"'")
      },
      // flags
      flags: [],
    },
    header: {
      name: "Header",
      background_color: [0, 50, 222, 0.7],
      // flags
      flags: [],
    },
    br: {
      //flags
      flags: [],
    },
    colorPicker: {
      name: "color",
      value: "...",
      onChange: (value) => {
        console.log("val of color picker changed to '"+value+"'")
      },
      // flags
      flags: [],
    },
    folder: {
      name: "folder",
      // flags
      flags: [],
    }
}
      
let confs = Object.keys(configs);
for (let i = 0; i < confs.length; i++) {
  configs[confs[i]].type = confs[i]
}

const viz = {
    overTab: false,
    tabs: 0,
	padding: 5,
    type_colors: type_colors,
    configs: configs,
    elements: {},
}