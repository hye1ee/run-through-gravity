import {Subject} from './Subject.js';
import heartGif from '../assets/heartGif.gif';

class Life extends Subject {
    constructor(x, y, blockSize){
        super();
        this.posX = x/2;
        this.posY = blockSize*0.8;
        this.width = blockSize*5;
        this.height = blockSize*0.6;
        this.gauge = 100;
        this.interval = null;
    }
    retry(x, y, blockSize){ //*initialization for game restart
        this.posX = x/2;
        this.posY = blockSize*0.8;
        this.width = blockSize*5;
        this.height = blockSize*0.6;
        this.gauge = 100;
        this.interval = null;
    }
    
    init(){  //*wait for image loading
        return new Promise((resolve)=>{
            this.img = loadImage(heartGif, ()=>{
                resolve();
            });
        })
    }
 
    draw(){ //*draw life gauge
        imageMode(CENTER);
        stroke('#111111');
        fill(255);
        strokeWeight(3);
        rect(this.posX-this.width/2, this.posY-this.height/2, this.width, this.height*0.5, this.height/2);
        strokeWeight(0);
        //* only draw when gauge is left, else notify to observer
        if(this.gauge>0){
            const x = this.posX-this.width/2 + this.width*(this.gauge/100);
            fill('#111111');
            rect(this.posX-this.width/2, this.posY-this.height/2, this.width*(this.gauge/100), this.height*0.5, this.height/2);
            image(this.img, x, this.posY*0.85,this.height*1.2,this.height*1.2);
        }
        else this.notifySubscribers('die');
    }
    update(source, ...others){ //*life observes map 
        if(source == 'start'){ //*detect game start
            this.interval = setInterval(()=>this.gauge-=1, 60);
        }
        if(source == 'move'){ //*increase gauge when user makes correct move
            this.gauge += 5;
            if(this.gauge > 100)this.gauge =100;
        }
        if(source == 'fall' || source == 'end'){ //*make game end
            clearInterval(this.interval);
        }

    }


}
export { Life };