// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import * as auth from "firebase/auth";
import * as firestore from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDUflHpJ9s580MkEVwrTEjGjO3_rR1D3RE",
    authDomain: "spotify-d6fcd.firebaseapp.com",
    projectId: "spotify-d6fcd",
    storageBucket: "spotify-d6fcd.appspot.com",
    messagingSenderId: "220667644810",
    appId: "1:220667644810:web:4999076e9c7f924d4e9673",
    measurementId: "G-SVZDY9832D",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = auth;
const db = firestore;

export { firebaseAuth, db };
export default firebaseApp;
