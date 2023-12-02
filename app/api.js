const ANI_FUNCTION = TWEEN.Easing.Circular.InOut

const ART_VOLUME = innerHeight/3;

const PULL_OUT_TIME = 100; // animation time for opening new link
const ART_HOVER_TIME = 100; // animation time for when hovering over article
const ART_HOVER_EXPAND = innerHeight/10;


const LINK_VOl = ART_VOLUME/2; // the size of a link
const LINK_DIST = innerHeight/3;

const OPEN_DIST = 500;

const url = "https://en.wikipedia.org/w/api.php?action=parse&format=json";

function getPage(page = "Tetris") {
    /*
      I was and still am very new to using API when i started this project, and if anyone else is, here is a little note. 
      
      CORs policy can be a little annoying, its like an embargo on data for the internet. 
      But when using the WikiMedia api, setting the origin header to '*', let me get around a lot of troube. See this line: 
      
      fetch(url + `&page=${page}` + "&origin=*")
      
      "&origin=*"
      
      -Jacod
    */
  
    return new Promise((resolve) => {
        fetch(url + `&page=${page}` + "&origin=*")
        .then(function(response){ return response.json(); })
        .then(function(res) {
            resolve(res);
        });
    });
}

function parseLinks(raw) { // turns the raw links to nice links :)
    let out = [];

    for (let i = 0; i < raw.length; i++) {
        let link = raw[i];
        if (link.ns == 0) { // this the kinda link we want
            out.push({
                name: link['*']
            });
        }
    }

    return out;
}


function goodLink(article) { 
  /*
    returns true if this article is good enough to be linked to another article
  */
  
  try {
    if (article.title == undefined) { return false }
    if (article.properties[0]['*'] == undefined) { return false }
  } catch(err) {
    return false;
  }
  
  return true;
}

function calcVolume(mass) {
    // return Math.sqrt(mass)
    return innerHeight/3
}