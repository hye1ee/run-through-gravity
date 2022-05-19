import userGif from '../assets/userGif.gif';
import overSong from '../assets/overSound.mp3';


class User {
    constructor(width, height, blockSize){ //*get screen size and unit size
        this.posX = Math.floor(width*0.2);
        this.posY = Math.floor(height/2);
        this.blockSize = blockSize;
    }
    init(){ //*wait for image loading
        return new Promise((resolve)=>{
        this.img = loadImage(userGif, ()=>{
            this.overSong = loadSound(overSong, ()=>{
                resolve();
            });
        });
        })
    } 
    retry(width, height, blockSize){ //*initialization for game restart
        this.posX = Math.floor(width*0.2);
        this.posY = Math.floor(height/2);
        this.blockSize = blockSize;
    }

    draw(){ //*draw user
        imageMode(CENTER);
        image(this.img, this.posX, this.posY, this.blockSize, this.blockSize);
    }
    getPosX(){ //*return x position
        return this.posX;
    }
    getPosY(){ //*return y position
        return this.posY;
    }
    update(source, ...others){ //* user observes map
        if(source == 'fall'){ //* user detects gameover and show popup
            this.makeFall(others[0].gravity);
        }
    }
    makeFall(gravity){ //* make userfall before game over
        if(!this.overSong.isPlaying())this.overSong.play();
        //* move animation
        let increment = 1 ;  
        const move = setInterval(()=>this.posX+=5,2);
        setTimeout(()=>{ 
            clearInterval(move);
            const fall = setInterval(()=> {
                this.posY += (gravity?1:-1)*increment; 
                increment += 0.1 ;
            },5);
            setTimeout(()=>{
                clearInterval(fall);
                document.getElementById('overPopup').className = "popup Show";
            },500);
        },80);


    }
}
export { User };