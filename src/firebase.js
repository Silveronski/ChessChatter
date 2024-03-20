import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyCbTGisl9Yea7qWrT97VH--NwENSqLp_Ow",
    authDomain: "backgammon-chatter.firebaseapp.com",
    projectId: "backgammon-chatter",
    storageBucket: "backgammon-chatter.appspot.com",
    messagingSenderId: "708028010012",
    appId: "1:708028010012:web:6b34844b67f71571df19d9"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();