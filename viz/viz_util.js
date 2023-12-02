function rng(min, max) {
  return (Math.random()*(max-min))+min
}

function clamp(n, min, max) {
    if (n > max) {return max};
    if (n < min) {return min};
    return n;
}
function countDecimal(n) {
    let s = String(n).split('.');
    if (s.length == 1) {
        return 0;
    }else {
        return String(n).split('.')[1].length;
    }
}
function cleanFloat(num, d = 2) {
  return parseFloat(num.toFixed(d))
}
function cRandom(n = 2) {
    return parseFloat(Math.random().toFixed(n));
}
function forceProcessAngle(a) {
  const pi2 = Math.PI*2;
  
  while (a < 0 || a > pi2) {
    if (a > pi2) {
      a -= pi2;
    }
    if (a < 0) {
      a += pi2;
    }
  }
  return a;
}

function rngrgb() {
  return [Math.random()*255, Math.random()*255, Math.random()*255];
}

function pythagorean(x1, y1, x2, y2) {
  let a = (x1 - x2) * (x1 - x2);
  let b = (y1 - y2) * (y1 - y2);
  let c = Math.sqrt(a + b);
  return c;
}

function parseBoolean(bool) {
  let boolString = "True"; 
  let boolValue = (bool.toLowerCase() === "true"); 
  return (boolValue); // true
}

function copyArray(arr) {
  let copy = [];

  for (i = 0; i < arr.length; i++) {
    copy[i] = arr[i];
  }
  
  return copy;
}