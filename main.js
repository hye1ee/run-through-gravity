import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

import signup from "./src/main/signup";
import signin from "./src/main/signin";
import nav from "./src/main/nav";

const init = () => {
  let auth;
  let db;

  const firebaseInit = () => {
    const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
    const app = initializeApp(firebaseConfig);

    db = getDatabase(app);
    auth = getAuth(app);

    signup(auth, db);
    signin(auth, db);
    nav(auth, db);
  };

  firebaseInit();
};
init();
