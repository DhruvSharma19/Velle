import { OAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";




const firebaseConfig = {
  apiKey: "AIzaSyBZZD6f1lOaVqALSrCX7ruI9Tu2auKO20s",
  authDomain: "velle-32bdf.firebaseapp.com",
  projectId: "velle-32bdf",
  storageBucket: "velle-32bdf.appspot.com",
  messagingSenderId: "4326770295",
  appId: "1:4326770295:web:a9d4a30c7f09cf140d6872"
};

const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth();


export const appleProvider = new OAuthProvider('apple.com');



export default app