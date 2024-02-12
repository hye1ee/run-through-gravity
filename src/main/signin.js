import { ref, child, get } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateUserInfo } from "./utils";

const signin = (auth, db) => {
  // Init
  window.localStorage.setItem("user", null);

  const signinButton = document.getElementById("signinButton");
  const introPage = document.getElementById("introPage");
  const mainPage = document.getElementById("mainPage");

  // Get current user information from db
  const getUser = (email) => {
    get(child(ref(db), "users/")).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const user in data) {
          if (data[user].email == email) {
            window.localStorage.setItem("user", JSON.stringify(data[user]));
            updateUserInfo(data[user]);
          }
        }
      }
    });
  };

  signinButton.onclick = () => {
    const email = document.getElementById("signinName").value;
    const password = document.getElementById("signinPassword").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Direct to game
        introPage.className = "page Item";
        mainPage.className = "page Show";

        if (auth.currentUser != null) {
          // Store user information to local storage
          getUser(auth.currentUser.email);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  };
};
export default signin;
