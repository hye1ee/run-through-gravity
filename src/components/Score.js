import {Subject} from './Subject.js';
import coinImg from '../assets/coinImg.png';
import scoreImg from '../assets/scoreImg.png';

class Score extends Subject {
    constructor(x, y, blockSize){
        super();
        this.score = 0;
        this.coin = 0;
        this.posX = x * 0.05;
        this.posY = y * 0.1;
        this.blockSize = blockSize;
    }
    retry(x, y, blockSize){ //*initialization for game restart
        this.score = 0;
        this.coin = 0;
        this.posX = x * 0.05;
        this.posY = y * 0.1;
        this.blockSize = blockSize;
    }
    
    init(){  //*wait for image loading
        return new Promise((resolve)=>{
            this.coinImg = loadImage(coinImg, ()=>{
                this.scoreImg = loadImage(scoreImg, ()=>{
                    resolve();
                })
            })
        })
    }

    draw(){ //* draw score on canvas
        image(this.scoreImg,this.blockSize*0.7,this.blockSize*0.5,this.blockSize*0.4,this.blockSize*0.4);
        image(this.coinImg,this.blockSize*0.7,this.blockSize*0.95,this.blockSize*0.4,this.blockSize*0.4);

        fill(0);
        textSize(this.blockSize/3);
        textAlign(LEFT, CENTER);
        text(this.score,this.blockSize*1.1,this.blockSize*0.55);
        text(this.coin,this.blockSize*1.1,this.blockSize);
    }
    getScore(){
        return this.score;
    }
    getCoin(){
        return this.coin;
    }
    updateScore(){ //* when user make correct move
        this.score+=10;
    }
    updateCoin(){
        this.coin ++;
    }
    update(source, ...others){ //* score observes map
        if(source == 'move') this.updateScore();
        if(source == 'coin') this.updateCoin();

    }

}
export { Score };