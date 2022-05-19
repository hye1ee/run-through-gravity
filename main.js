
import { initializeApp } from "firebase/app";
import { ref, child, get, set, getDatabase, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

//**----------------------------------------------------------**//
//** INITIALIZE **//
//**----------------------------------------------------------**//
const firebaseConfig = {
    apiKey: "AIzaSyCzv99hAVyOjMJfJaOxGhnulmGmQbPENkA",
    authDomain: "runthroughgravity.firebaseapp.com",
    projectId: "runthroughgravity",
    storageBucket: "runthroughgravity.appspot.com",
    messagingSenderId: "748014728129",
    appId: "1:748014728129:web:1c0f16b4e0bb55491df540"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

//* src get absolute path, so make same assets folder in dist
const noIconUrl = "assets/noIcon.svg";
const yesIconUrl = "assets/yesIcon.svg";
window.localStorage.setItem('user', null);

//**----------------------------------------------------------**//
//** FIREBASE SIGN IN **//
//**----------------------------------------------------------**//
const signinButton = document.getElementById('signinButton');
const introPage = document.getElementById('introPage');
const mainPage = document.getElementById('mainPage');

signinButton.onclick = () => {
    const email = document.getElementById('signinName').value;
    const password = document.getElementById('signinPassword').value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        introPage.className = "page Item";
        mainPage.className = "page Show";

        if(auth.currentUser != null){ //* store user information to local storage
            getUser(auth.currentUser.email);  
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}




//**----------------------------------------------------------**//
//** FIREBASE SIGN UP **//
//**----------------------------------------------------------**//
const signupButton = document.getElementById('signupButton');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');

const nameIcon = document.getElementById('nameIcon');
const nameNotice = document.getElementById('nameNotice');
const emailIcon = document.getElementById('emailIcon');
const emailNotice = document.getElementById('emailNotice');
const passwordIcon = document.getElementById('passwordIcon');
const passwordNotice = document.getElementById('passwordNotice');
let validflag = [0,0,0];
signupName.oninput = () => { //* for name input
    get(child(ref(database),'users/')).then((snapshot) => {
        if (snapshot.exists()) { //* if the username is already taken do not
            const data = snapshot.val()
            for(const user in data){ //* user db linear search
                if(data[user].username==signupName.value){ //* if email is already taken
                    validflag[0] = 0; 
                    signupButton.className = "boxButton Inactive";
                    nameIcon.className = "iconimg Show";
                    nameIcon.src = noIconUrl;
                    nameNotice.innerText = "Already Taken";
                    return;
                }
            }
            //* if email is valid
            //* check whether name is also valid for button activation
            validflag[0] = 1;
            if(validflag[1]&&validflag[2]) signupButton.className = "boxButton";
        
            nameIcon.className = "iconimg Show";
            nameIcon.src = yesIconUrl;
            nameNotice.innerText = "Seems Good!";
        }
    }).catch((error) => {
        console.error(error);
    });
}
signupEmail.oninput = () => { //* for email input
    get(child(ref(database),'users/')).then((snapshot) => {
        if (snapshot.exists()) { //* if the username is already taken do not
            const data = snapshot.val()
            for(const user in data){ //* user db linear search
                if(data[user].email==signupEmail.value){ //* if email is already taken
                    validflag[1] = 0; 
                    signupButton.className = "boxButton Inactive";
                    emailIcon.className = "iconimg Show";
                    emailIcon.src = noIconUrl;
                    emailNotice.innerText = "Already Taken";
                    return;
                }
            }
            //* if email is valid
            //* check whether name is also valid for button activation
            validflag[1] = 1; 
            if(validflag[0]&&validflag[2]) signupButton.className = "boxButton";

            emailIcon.className = "iconimg Show";
            emailIcon.src = yesIconUrl;
            emailNotice.innerText = "Seems Good!";
        }
    }).catch((error) => {
        console.error(error);
    });
}
signupPassword.oninput = () => { //* for password input
    if(signupPassword.value.length >= 6){
        validflag[2] = 1;
        if(validflag[0] && validflag[1]) signupButton.className = "boxButton";
        passwordIcon.className = "iconimg Show";
        passwordIcon.src = yesIconUrl;
        passwordNotice.innerText = "Seems Good!";

    }else{
        validflag[2] = 0;
        signupButton.className = "boxButton Inactive";
        passwordIcon.className = "iconimg Show";
        passwordIcon.src = noIconUrl;
        passwordNotice.innerText = "Should be longer";
    }

}

signupButton.onclick = () => { //* register user
    if(signupButton.className == "boxButton"){ //* only if button is active
        const name = signupName.value;
        const email = signupEmail.value;
        const password = document.getElementById('signupPassword').value;
        //* add new user
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          console.log(error.message);
        });
        //* add to user db
        set(ref(database, 'users/'+name), {
            username : name,
            email : email,
            maxscore : 0,
            coins : 0,
            items : {}
        });
        //* link to signin page
        signinPage.className = 'content Show';
        signupPage.className = 'content Item';
        
    }
}
//**----------------------------------------------------------**//

//**----------------------------------------------------------**//
//** USER INFORMATION
//** store user information to local storage with every login
//** show information on my page
//**----------------------------------------------------------**//
const getUser = (email) => { //* get user object from db with email
    console.log(email);
    get(child(ref(database),'users/')).
    then((snapshot) => {
        if (snapshot.exists()) { //* if the username is already taken do not

            const data = snapshot.val();
            console.log(data);
            for(const user in data){ //* user db linear search
                if(data[user].email == email){ //* find user object
                    window.localStorage.setItem('user', JSON.stringify(data[user]));
                    setUser();
                    return data[user];
                }
            } 
        }
        return null;
    })
}

const setUser = () => { //* set my page and update user db
    const userObj = JSON.parse(window.localStorage.getItem('user'));
    set(ref(database, 'users/' + userObj.username), userObj)
    .then(()=>console.log('db updated'));

    const myName = document.getElementById('myName');
    const myCoins = document.getElementById('myCoins');
    const myScore = document.getElementById('myScore');
    myName.innerText = userObj.username;
    myCoins.innerText = userObj.coins;
    myScore.innerText = userObj.maxscore;
}

const rankItems = document.getElementById('rankItems');
const allUser = () => { //* get all users maxscore for ranking from db
    let rankHtml = "";
    let rankData = [];
    get(child(ref(database),'users/')).
    then((snapshot) => {
        if (snapshot.exists()) { //* if the username is already taken do not
            const data = snapshot.val();
            for(const user in data){ //* user db linear search
                rankData.push(data[user]);
            }
        }
        rankData.sort((a,b)=>b.maxscore-a.maxscore); //* sort user array in order to score
        console.log(rankData);
        //* update rankItems html with new data
        rankData.map((obj,idx)=>{
                if(obj.email == auth.currentUser.email){
                    rankHtml += 
                    `<div class="detailItem middletext myItem">
                        <div class="textleft">${idx+1}</div>
                        <div class="textmid">${obj.username}</div>
                        <div class="textright">${obj.maxscore}</div>
                    </div>`
                }else{
                    rankHtml += 
                    `<div class="detailItem middletext">
                        <div class="textleft">${idx+1}</div>
                        <div class="textmid">${obj.username}</div>
                        <div class="textright">${obj.maxscore}</div>
                    </div>`
                }
            }
        );
        rankItems.innerHTML = rankHtml;
    });
}

//**----------------------------------------------------------**//
//** PAGE SHOWING **//
//* the tab which includes "Show" in class name will be shown in the screen
//* else tabs include "Item"
//**----------------------------------------------------------**//
//* intro page
const signupLink = document.getElementById('signupLink');
const signinLink = document.getElementById('signinLink');
const signupPage = document.getElementById('signupPage');
const signinPage = document.getElementById('signinPage');

signupLink.onclick = () =>{
    signupPage.className = 'content Show';
    signinPage.className = 'content Item';
}
signinLink.onclick = () =>{
    signinPage.className = 'content Show';
    signupPage.className = 'content Item';
}

//* main page
const playContent = document.getElementById("playContent");
const myContent = document.getElementById("myContent");

const mypageButton = document.getElementById("mypageButton");
const playpageButton = document.getElementById("playpageButton");

const retryButton = document.getElementById("retryButton");
const rankButton = document.getElementById("rankButton");


const goMypage = () => { 
    setUser();
    allUser();
    //getUser(JSON.parse(window.localStorage.getItem('user')).email); //* reload user information
    myContent.className = 'content Show';
    playContent.className = 'content Item';
    mypageButton.className = 'tabButton Selected';
    playpageButton.className = 'tabButton';
    document.getElementById('overPopup').className = "popup Item";
}
const goPlaypage = () => {
    mypageButton.className = 'tabButton';
    playpageButton.className = 'tabButton Selected';
    playContent.className = 'content Show retry';
    myContent.className = 'content Item';
}

mypageButton.onclick = goMypage;
playpageButton.onclick = goPlaypage;


rankButton.onclick = goMypage;
retryButton.onclick = () => {
    myContent.className = 'content Item';
    playContent.className = 'content Show retry';
    document.getElementById('overPopup').className = "popup Item";
};

//**----------------------------------------------------------**//
//** INTRO PAGE **//
//**----------------------------------------------------------**//
const introItem1 = document.getElementById('introItem1');
const introItem2 = document.getElementById('introItem2');
const introItem3 = document.getElementById('introItem3');
const introItems = [introItem1, introItem2, introItem3];

const nextItem = () => {
    let index = 0;
    for(let i=0 ; i<introItems.length ; i++){
        if(introItems[i].className == "introItem Show"){
            index = (i+1)%introItems.length;
            break;
        }
    }
    for(let i=0 ; i<introItems.length ; i++){
        if(index == i)introItems[i].className = "introItem Show";
        else introItems[i].className = "introItem Item";
    }
}
introItem1.onclick = nextItem;
introItem2.onclick = nextItem;
introItem3.onclick = nextItem;