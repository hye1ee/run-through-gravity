
class Shadow {
    constructor(width, height, score){
        this.start = false;
        this.width = width;
        this.height = height;
        this.score = score;
        this.flag = true;
    }
    retry(width, height, score){ //*initialization for game restart
        this.start = false;
        this.width = width;
        this.height = height;
        this.user = score;
        this.flag = true;
    }

    drawOpenShadow(){
        fill(0,0,0,100);
        rect(0,0,this.width,this.height);
        textAlign(CENTER);
        textSize(30);
        fill(255);
        text("Press Space to Start",this.width/2,this.height/2);
    }
    drawCloseShadow(){
        if(this.flag){ //* check the flag to update local storage only once
            this.updateLocalStorage();
            this.flag = false;
        }
        fill(0,0,0,100);
        rect(0,0,this.width,this.height);
    }
    updateLocalStorage(){ //* store game result to local storage
        const score = this.score.getScore();
        const coins = this.score.getCoin();
        document.getElementById('popupScore').innerText = score;
        document.getElementById('popupCoin').innerText = coins;

        let userObj = JSON.parse(window.localStorage.getItem('user'));
        if(userObj.maxscore < score) userObj.maxscore = score;
        userObj.coins += coins;
        window.localStorage.setItem('user',JSON.stringify(userObj));
    }

    draw(){
        if(!this.start)this.drawOpenShadow(); //*close open shadow when game start
        else if(document.getElementById('overPopup').className == "popup Show")this.drawCloseShadow(); //*show close shadow with popup after userfall
    }

    update(source, ...others){
        if(source == 'start')this.start = true;
    }


}
export { Shadow };