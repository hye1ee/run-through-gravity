import {Block} from './Block.js';
import {Subject} from './Subject.js';
import block1Gif from '../assets/block1Gif.gif';
import block2Gif from '../assets/block2Gif.gif';
import coinGif from '../assets/coinGif.gif';
import back1Img from '../assets/back1Img.png';
import coinSound from '../assets/coinSound.wav';

class Map extends Subject {
    constructor(x,y,blockSize){
        super();
        this.gravity = true; //*TRUE indicates downward gravity, FALSE indicates upward gravity
        this.blocks = []; //*block objects
        this.blockSize = blockSize;
        this.blockX = Math.floor(this.blockSize * 1.5);
        this.blockY = Math.floor(this.blockSize * 0.5);

        this.length = 8;
        this.valid = true; //*turns false when game over
        this.start = false; //*does the game started
        
        this.index = 0; //*index of block which locates with user
        this.x = x; //*x position of user
        this.y = y; //*y position of user
        this.initBlocks();
    }
    initBlocks(){ //* initialize blocks
        this.blocks = [];
        this.blocks.push(new Block(Math.random()>0.5, this.blockSize));
        this.blocks[0].posX = this.x;
        this.blocks[0].posY = this.y + (this.gravity?this.blockSize*(0.75):this.blockSize*(-0.75));

        for(let i=1 ; i<this.length ; i++){ //* make new block object with relative position and add to array
            const location = Math.random()>0.5;
            let blockObj = new Block(location,this.blockSize);
            blockObj.posX = this.blocks[i-1].posX + this.blockX;
            blockObj.posY = this.blocks[i-1].posY + (blockObj.location?-this.blockY : this.blockY);
            this.blocks.push(blockObj);
        }
    }
    flipBlocks(){ //* relocate blocks with changed gravity direction
        //this.blocks[this.index].posY = this.y + (this.gravity?this.blockSize*(0.75):this.blockSize*(-0.75));
        this.blocks[this.index].posY = this.y + this.blockSize*(0.75);
        for(let i=this.index+1 ; i<this.index+this.length ; i++){ //* update relative y position
            if(this.gravity)this.blocks[i].posY = this.blocks[i-1].posY + (this.blocks[i].location?-this.blockY : this.blockY);
            else this.blocks[i].posY = this.blocks[i-1].posY + (this.blocks[i].location?this.blockY : -this.blockY);
        }
        if(this.index && this.gravity)this.blocks[this.index-1].posY = this.blocks[this.index].posY + (this.blocks[this.index].location?this.blockY:-this.blockY);
        else if(this.index)this.blocks[this.index-1].posY = this.blocks[this.index].posY + (this.blocks[this.index].location?-this.blockY:this.blockY);
    }

    retry(x,y,blockSize){ //*initialization for game restart
        this.gravity = true;
        this.blocks = [];
        this.blockSize = blockSize;
        this.length = 8;
        this.valid = true;
        this.start = false;
        
        this.index = 0; 
        this.x = x; 
        this.y = y;
        this.initBlocks();
    }
    
    init(){  //*wait for image and sound loading
        return new Promise((resolve)=>{
            this.img1 = loadImage(block1Gif, ()=>{
                this.img2 = loadImage(block2Gif, ()=>{
                    this.coin = loadImage(coinGif, ()=>{
                        this.back = loadImage(back1Img, ()=>{
                            this.coinSound = loadSound(coinSound,()=>{
                                this.initBlocks();
                                resolve();
                            })
                        })
                    })
                })
            });
        })
    }

    draw(){
        //* draw blocks
        if(!this.gravity){ //*if gravity is upward
            translate(0, height);
            scale(1, -1);
        }
        imageMode(CORNERS);
        image(this.back,0,0,width,height);
        imageMode(CENTER);
        for(let i = this.index?(this.index-1):this.index ; i < this.index + this.length-1  ; i++){
            image(this.blocks[i].img?this.img1:this.img2, this.blocks[i].posX, this.blocks[i].posY, this.blockSize, this.blockY);
            if(i && this.blocks[i].coin){ //* coin of first block will be ignored
                image(this.coin,this.blocks[i].posX, this.blocks[i].posY-this.blockSize*0.6,this.blockSize/2,this.blockSize/2);
            }
        }
        if(!this.gravity){
            translate(0, height);
            scale(1, -1);
        }
    }

    moveAnimation(){ //* moving map one block animation
        this.valid = false; //* block keyboard input during animation
        let i=1
        const animation = setInterval(()=>{
            if(i>14){ //* there was a counting bug when use setTimeout together, so count times itself
                clearInterval(animation);
                //* after animation update index and get coin
                this.index++;
                if(this.blocks[this.index].coin){ //* if user steps coin 
                    this.coinSound.play();
                    this.blocks[this.index].coin = false; //* remove coin
                    this.notifySubscribers('coin');
                }
                this.notifySubscribers('move');
                this.valid = true;
            }
            else i++;

            const dX = (this.blockX/15);
            const dY = (this.blockY/15);
            for(let i = this.index?(this.index-1):this.index ; i < this.blocks.length  ; i++){
                this.blocks[i].posX -= dX;
                this.blocks[i].posY -= dY;
            }
        },5); //* execute for 15times

    }
    moveBlocks(){ 
        if(!this.start){ //* detect game start
            this.notifySubscribers('start');
            this.start = true;
        }
        if(this.valid && (this.gravity != this.blocks[this.index+1].location)){ //* check whether move condition is correct
            //* add new block 
            const location = Math.random()>0.5
            let blockObj = new Block(location,this.blockSize);
            blockObj.posX = this.blocks[this.blocks.length-1].posX + this.blockX;
            blockObj.posY = this.blocks[this.blocks.length-1].posY + (blockObj.location?-this.blockY : this.blockY);
            this.blocks.push(blockObj);
            //* and then move
            this.moveAnimation();
        }else if(this.valid){ //* make user fall and end game
            this.valid = false;
            this.notifySubscribers('fall',{ gravity : this.gravity }); //* notify to user and pass gravity direction
            this.notifySubscribers('end');
        }

    }

    gravityDown(){ //*set gravity to down direction, when user press down key
        if(this.valid){
            this.gravity = true;
            this.flipBlocks();
        }
    }
    gravityUp(){ //*set gravity to up direction, when user press up key
        if(this.valid){
            this.gravity = false;
            this.flipBlocks();
        }
    }
    update(source, ...others){ //*map observes life
        if(source == 'die'){
            this.valid = false;
            document.getElementById('overPopup').className = "popup Show";
            this.notifySubscribers('end');
        }
    }

}
export { Map };