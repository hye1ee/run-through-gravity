import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, child, get, set } from "firebase/database";

const signup = (auth, db) => {
  const signupButton = document.getElementById("signupButton");
  const signupName = document.getElementById("signupName");
  const signupEmail = document.getElementById("signupEmail");
  const signupPassword = document.getElementById("signupPassword");
  const signupPage = document.getElementById("signupPage");
  const signinPage = document.getElementById("signinPage");

  const nameIcon = document.getElementById("nameIcon");
  const nameNotice = document.getElementById("nameNotice");
  const emailIcon = document.getElementById("emailIcon");
  const emailNotice = document.getElementById("emailNotice");
  const passwordIcon = document.getElementById("passwordIcon");
  const passwordNotice = document.getElementById("passwordNotice");

  const noIconUrl = "assets/noIcon.svg";
  const yesIconUrl = "assets/yesIcon.svg";

  const updateUsernameValid = () => {
    nameIcon.className = "iconimg Show";
    nameIcon.src = yesIconUrl;
    nameNotice.innerText = "Seems Good!";
    return true;
  };
  const updateUsernameInvalid = () => {
    nameIcon.className = "iconimg Show";
    nameIcon.src = noIconUrl;
    nameNotice.innerText = "Already Taken or should be longer";
    return false;
  };

  const checkUsername = () => {
    const inputVal = signupName.value;
    if (inputVal === "") return updateUsernameInvalid();

    return get(child(ref(db), "users/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          for (const user in data) {
            if (data[user].username == inputVal) {
              return updateUsernameInvalid();
            }
          }
          return updateUsernameValid();
        }
      })
      .catch((error) => {
        console.error(error.message);
        return updateUsernameInvalid();
      });
  };

  const updateEmailValid = () => {
    emailIcon.className = "iconimg Show";
    emailIcon.src = yesIconUrl;
    emailNotice.innerText = "Seems Good!";
    return true;
  };
  const updateEmailInvalid = () => {
    //   signupButton.className = "boxButton Inactive";
    emailIcon.className = "iconimg Show";
    emailIcon.src = noIconUrl;
    emailNotice.innerText = "Already Taken or should be longer";
    return false;
  };

  const checkEmail = () => {
    const inputVal = signupEmail.value;
    if (inputVal === "") return updateEmailInvalid();

    return get(child(ref(db), "users/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          for (const user in data) {
            if (data[user].email == inputVal) {
              return updateEmailInvalid();
            }
          }
          return updateEmailValid();
        }
      })
      .catch((error) => {
        console.error(error.message);
        return updateEmailInvalid();
      });
  };

  const updatePasswordValid = () => {
    passwordIcon.className = "iconimg Show";
    passwordIcon.src = yesIconUrl;
    passwordNotice.innerText = "Seems Good!";
    return true;
  };
  const updatePasswordInvalid = () => {
    //   signupButton.className = "boxButton Inactive";
    passwordIcon.className = "iconimg Show";
    passwordIcon.src = noIconUrl;
    passwordNotice.innerText = "Should be longer";
    return false;
  };

  const checkPassword = () => {
    if (signupPassword.value.length >= 6) {
      return updatePasswordValid();
    } else {
      return updatePasswordInvalid();
    }
  };

  signupButton.onclick = () => {
    // Check validity
    if (!checkUsername()) return;
    if (!checkEmail()) return;
    if (!checkPassword()) return;

    // Add user authentication
    const name = signupName.value;
    const email = signupEmail.value;
    const password = signupPassword.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {})
      .catch((error) => {
        console.error(error.message);
      });

    // Add user db
    set(ref(db, "users/" + name), {
      username: name,
      email: email,
      maxscore: 0,
      coins: 0,
    });

    // Link to signin
    signinPage.className = "content Show";
    signupPage.className = "content Item";
  };
};
export default signup;
