import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { config } from './firebaseConfig.js';

export const app = initializeApp(config);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();