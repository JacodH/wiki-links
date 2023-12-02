const urlParams = new URLSearchParams(window.location.search);
new Article(urlParams.get('link') || "Tetris");

var cam = new Camera();
function setup() {
  createCanvas(innerWidth, innerHeight);
  textFont("Linux Libertine"); // wiki font
  textAlign(CENTER);
  
  cam.init();
}

function draw() {
  cam.update();
  background(240, 240, 240);
  
  for (let i = 0; i < articles.length; i++) {
    articles[i].render();
  }
}

function mouseClicked() {
  
  if (getSelected().ani.hover_right_bracket == true) {
    getSelected().cycleNextLinks();
  } 
  if (getSelected().ani.hover_left_bracket == true) {
    getSelected().cyclePastLinks();
  }
  
  for (let i = 0; i < articles.length; i++) {
    let art = articles[i];
    if (pythagorean(cam.mx, cam.my, art.x, art.y) < art.vol / 2) {
    
      // window.open('https://en.wikipedia.org/wiki/'+art.name);
      
    }
  }
  
  
  if (getSelected().ani.mouse_in == false) {
    let links = getSelected().links;

    for (let i = 0; i < links.length; i++) {
      let link = links[i];

      if (pythagorean(cam.mx, cam.my, link.x, link.y) < link.vol / 2) {
        console.log(link.name);

        let x = cos(link.a) * OPEN_DIST;
        let y = sin(link.a) * OPEN_DIST;

        x += link.x;
        y += link.y;

        new Article(link.name, link.x, link.y, x, y);

        cam.goto(x, y).start();

      }
    }
  }
}
function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}