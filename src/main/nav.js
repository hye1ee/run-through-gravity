import { updateUserInfo } from "./utils";
import { ref, child, get, set } from "firebase/database";

const nav = (auth, db) => {
  // -------------------------
  // Intro page
  // -------------------------
  const introItem1 = document.getElementById("introItem1");
  const introItem2 = document.getElementById("introItem2");
  const introItem3 = document.getElementById("introItem3");
  const introItems = [introItem1, introItem2, introItem3];

  const nextItem = () => {
    let index = 0;
    for (let i = 0; i < introItems.length; i++) {
      if (introItems[i].className == "introItem Show") {
        index = (i + 1) % introItems.length;
        break;
      }
    }
    for (let i = 0; i < introItems.length; i++) {
      if (index == i) introItems[i].className = "introItem Show";
      else introItems[i].className = "introItem Item";
    }
  };
  introItem1.onclick = nextItem;
  introItem2.onclick = nextItem;
  introItem3.onclick = nextItem;

  // -------------------------
  // Sign up & in pages
  // -------------------------
  const signupLink = document.getElementById("signupLink");
  const signinLink = document.getElementById("signinLink");
  const signupPage = document.getElementById("signupPage");
  const signinPage = document.getElementById("signinPage");

  signupLink.onclick = () => {
    signupPage.className = "content Show";
    signinPage.className = "content Item";
  };
  signinLink.onclick = () => {
    signinPage.className = "content Show";
    signupPage.className = "content Item";
  };

  // -------------------------
  // Game pages
  // -------------------------
  const playContent = document.getElementById("playContent");
  const myContent = document.getElementById("myContent");

  const mypageButton = document.getElementById("mypageButton");
  const playpageButton = document.getElementById("playpageButton");

  const retryButton = document.getElementById("retryButton");
  const rankButton = document.getElementById("rankButton");

  // Store local user information to db
  const updateUser = () => {
    const userObj = JSON.parse(window.localStorage.getItem("user"));
    set(ref(db, "users/" + userObj.username), userObj).then(() => {});
    updateUserInfo(userObj);
  };
  // Get all user information from db
  const getAllUsers = () => {
    const rankItems = document.getElementById("rankItems");

    let rankHtml = "";
    let rankData = [];
    get(child(ref(db), "users/")).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const user in data) {
          rankData.push(data[user]);
        }
      }
      // Sort user data based on maxscore
      rankData.sort((a, b) => b.maxscore - a.maxscore);
      console.log(rankData);

      // Update rank data with sort result
      rankData.map((obj, idx) => {
        if (obj.email == auth.currentUser.email) {
          rankHtml += `<div class="detailItem middletext myItem">
                          <div class="textleft">${idx + 1}</div>
                          <div class="textmid">${obj.username}</div>
                          <div class="textright">${obj.maxscore}</div>
                      </div>`;
        } else {
          rankHtml += `<div class="detailItem middletext">
                          <div class="textleft">${idx + 1}</div>
                          <div class="textmid">${obj.username}</div>
                          <div class="textright">${obj.maxscore}</div>
                      </div>`;
        }
      });
      rankItems.innerHTML = rankHtml;
    });
  };

  const navMypage = () => {
    updateUser();
    getAllUsers();

    //getUser(JSON.parse(window.localStorage.getItem('user')).email); //* reload user information
    myContent.className = "content Show";
    playContent.className = "content Item";
    mypageButton.className = "tabButton Selected";
    playpageButton.className = "tabButton";
    document.getElementById("overPopup").className = "popup Item";
  };
  const navPlaypage = () => {
    mypageButton.className = "tabButton";
    playpageButton.className = "tabButton Selected";
    playContent.className = "content Show retry";
    myContent.className = "content Item";
  };

  mypageButton.onclick = navMypage;
  playpageButton.onclick = navPlaypage;
  rankButton.onclick = navMypage;
  retryButton.onclick = () => {
    myContent.className = "content Item";
    playContent.className = "content Show retry";
    document.getElementById("overPopup").className = "popup Item";
  };
};
export default nav;
