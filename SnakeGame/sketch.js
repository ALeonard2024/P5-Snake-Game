
var gridSize
var space

var snake
var food

var dir
var img

var deadsound

var score

let monoSynth;

let port;
let writer;
let slider;

document.addEventListener('keydown', function(k) {
    dir = k.code
})

function playSynth() {
  userStartAudio();

  let note = random(['Fb4']);
  // note velocity (volume, from 0 to 1)
  let velocity = random();
  // time from now (in seconds)
  let time = 0;
  // note duration (in seconds)
  let dur = 1/6;

  monoSynth.play(note, velocity, time, dur);
}

function preload() {
  img = loadImage('gameover.png')
  deadsound = loadSound("gameover.wav")
}

function setup() {
  createCanvas(900, 900);

 

  if ("serial" in navigator){
    let button = createButton("Connect to start");
      button.position(395,878);
      button.mousePressed(connect);
  } 
  
  slider = createSlider(0,3, 175);
  slider.position(520,878);
  slider.style('width', '100px');

  rectMode(CENTER)
  imageMode(CENTER)
  frameRate(10)
  
  
  gridSize = 20;
  space = width / gridSize;

  snake = new Snake()

  food = new Food()

  score = createP('Score:').position(80,0).style('font-size: 40px; opacity: 1')
}

function draw() {
  background(175, 90, 150);
  monoSynth = new p5.MonoSynth(playSynth);

  if(!snake.dead) {
    snake.move()
    snake.edges()
    snake.eat()
    snake.tail()
    snake.show()
  
    food.show()

   
  } else {
    image(img, width / 2, height / 2)
  }

  
  noFill()
  stroke(10, 20, 30)
  strokeWeight(space)

  rect(width / 2, height / 2, width, height)

  score.html('Score: ' + snake.length)
  if (writer) {
    writer.write(new Uint8Array([slider.value()]));
  }
  
}

async function connect() {
  port = await navigator.serial.requestPort();

  await port.open({ baudRate: 9600});

  writer = port.writable.getWriter();
}

class Snake{
  constructor() {
    this.pos = createVector(450,450)
    
    this.length = 1

    this.posHistory = [this.pos]

    this.dead = false
  }

  move() {
    if(dir === 'ArrowRight') {
      this.pos.x += space
    } else if (dir === 'ArrowLeft') {
      this.pos.x -= space
    } else if(dir === 'ArrowUp'){
      this.pos.y -= space
    } else if (dir === 'ArrowDown'){
      this.pos.y += space
    }
  }

  edges(){
    if (this.pos.x === 0 || this.pos.x === width || this.pos.y === 0 || this.pos.y === height) {
      this.dead = true
      
      deadsound.play()
      
    }

    for(var i = 0; i < this.posHistory.length - 1; i++) {
      if (this.pos.x === this.posHistory[i].x && this.
        pos.y === this.posHistory[i].y) {
          this.dead = true
          deadsound.play()
        }
    }
  }

  eat() {
    if (this.pos.x === food.x && this.pos.y === food.y){
      food.newPos()

      this.length += 1

      monoSynth.play()
    }
  }

  tail() {
    this.posHistory.push(this.pos.copy())

    if (this.posHistory.length > this.length) {
      this.posHistory.splice(0, 1)
    }
  }

  show() {
    noStroke()
    fill(255)
    
    for (var i = 0; i < this.posHistory.length; i++) {
      rect(this.posHistory[i].x, this.posHistory[i].y, 
        space - 5)
    }
  }
}

class Food {
  constructor() {
    this.x = floor(random(1, gridSize)) * space
    this.y = floor(random(1, gridSize)) * space
  }

  newPos() {
    this.x = floor(random(1, gridSize)) * space
    this.y = floor(random(1, gridSize)) * space
  }

  show(){
    noStroke()
    fill(255, 50, 50)

    rect(this.x, this.y, space / 2)
  }
}
