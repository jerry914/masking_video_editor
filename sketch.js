let fingers;
var i, j;
let pix = 5;
let dur;
let rects = [];
let sx, sy, bx, by;
let locked = false;
let choiseStop = false;
let temp_data;
let playing = false;

let video_loaded = false;

function setup() {
  createCanvas(windowWidth, windowHeight+80);
  
  noStroke();
  document.getElementById("time_slide").disabled = true;
}

function load_video(src){
  fingers = createVideo(src);
  fingers.loop();
  fingers.hide();
  fingers.showControls();
  video_loaded = true;
  playing = true;
}
function video_play(){
  if(playing){
    fingers.pause();
    playing = false;
  }
  else{
    fingers.play();
    playing = true;
  }
}

var slide = document.getElementById('slider');
var time_slide = document.getElementById('time_slide');

slide.onchange = function() {
  let jump_time = map(this.value,0,100,0,dur);
  fingers.time(jump_time);
}

function full_screen(){
  let fs = fullscreen();
  fullscreen(!fs);
}

function draw() {
  if(video_loaded){
    if (!dur) {
      dur = fingers.duration();
      console.log(dur);
    }

    background(220);
    time_slide.value = map(fingers.time(),0,100,0,dur);

    rideo_player();

    fill('#ff000055');
    rect(sx, sy, bx - sx, by - sy);
  }
  
}

function mousePressed() {
  
  if (!locked && !choiseStop && mouseY<height && mouseY>=0 && video_loaded) {
    sx = mouseX;
    sy = mouseY;
    bx = mouseX;
    by = mouseY;
    locked = true;
  }
}

function mouseDragged() {
  if (locked && !choiseStop) {
    bx = mouseX;
    by = mouseY;
  }
}

function mouseReleased() {
  if(!choiseStop && locked){
    locked = false;
    choiseStop = true;
    temp_data = {
      start_time: fingers.time(),
      pos_x: sx, 
      pos_y: sy, 
      wid: bx-sx, 
      hei: by-sy
    };
  }
}

function confirm_stop(){
  if(choiseStop){
    let st = fingers.time();
    temp_data['end_time']=st;
    // console.log(temp_data);
    rects.push(new Rect(temp_data.start_time, temp_data.end_time, temp_data.pos_x, temp_data.pos_y, temp_data.wid, temp_data.hei));
    bx=sx;
    by=sy;
    choiseStop=false;
  }
  
  
}

function rideo_player() {
  fingers.loadPixels();

  var ratioHeight = fingers.height*(width/fingers.width);
  image(fingers, 0, 0,width,ratioHeight);


  let cur = fingers.time();

  for (var r = 0; r < rects.length; r++) {
    let rec = rects[r];
    if (cur >= rec.start_time && cur <= rec.end_time) {
      biger = get(rec.pos_x, rec.pos_y, rec.width, rec.height);

      let squareColor = color(0, 0, 0);
      squareColor.setAlpha(100);
      fill(squareColor);
      rect(0, 0, width, height);
      image(biger, rec.pos_x - rec.width * 0.1, rec.pos_y - rec.height * 0.1, rec.width * 1.2, rec.height * 1.2);
    }
  }
}

class Rect {
  constructor(start_time, end_time, pos_x, pos_y, width, height) {
    this.start_time = start_time;
    this.end_time = end_time;
    this.height = height;
    this.width = width;
    this.pos_x = pos_x;
    this.pos_y = pos_y;
  }
}