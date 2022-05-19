// Single-sketch example
import { User } from './src/User.js';
import { Map } from './src/Map.js';
import { Life } from './src/Life.js';
import { Score } from './src/Score.js';
import { Shadow } from './src/Shadow.js';

let userObj;
let mapObj;
let lifeObj;
let scoreObj;
let shadowObj;
let preload = false;
const blockSize = 100; //* unit size for image drawing

function retry(){
  if(preload){ //* check whether it is retry or first canvas call
    userObj.retry(width, height,blockSize);
    lifeObj.retry(width, height, blockSize);
    mapObj.retry(userObj.getPosX(),userObj.getPosY(),blockSize);
    scoreObj.retry(width, height, blockSize);
    shadowObj.retry(width, height, scoreObj);
    document.getElementById('playContent').className = "content Show" //* after initialization change to normal state
  }
}

async function setup (){
  //*canvas setting
  const canvas = createCanvas (innerHeight*1.2, innerHeight*0.7);
  canvas.parent('playContent');

  //*object setting
  userObj = new User(width, height,blockSize);
  await userObj.init();

  lifeObj = new Life(width, height, blockSize);
  await lifeObj.init();

  scoreObj = new Score(width, height, blockSize);
  await scoreObj.init();

  shadowObj = new Shadow(width, height, scoreObj);

  mapObj = new Map(userObj.getPosX(),userObj.getPosY(),blockSize);
  await mapObj.init()
  .then(()=>preload = true);

  //*observe setting
  mapObj.subscribe(userObj); //* user observes map
  mapObj.subscribe(lifeObj); //* life observes map
  lifeObj.subscribe(mapObj); //* map observes life
  mapObj.subscribe(scoreObj); //* score observes map
  mapObj.subscribe(shadowObj); //* shadow observes map
}

function draw(){
  if(document.getElementById('playContent').className == "content Show retry")retry();
  if(!preload)return; //*make sure for complete setup function 

  //* draw each object
  mapObj.draw();
  userObj.draw();
  lifeObj.draw();
  scoreObj.draw();
  shadowObj.draw();
}

function keyPressed(){
  if(document.getElementById('playContent').className != "content Item"){ //*detect key pressing only if the canvas is showing
    if(keyCode == UP_ARROW) mapObj.gravityUp();
    if(keyCode == DOWN_ARROW) mapObj.gravityDown();
    if(key == ' ')mapObj.moveBlocks();
  }

}

window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;