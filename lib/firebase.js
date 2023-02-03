// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1F8fCJfkoCI2m6d6RTaKjl5hwrgJKsiQ",
  authDomain: "share-sql.firebaseapp.com",
  projectId: "share-sql",
  storageBucket: "share-sql.appspot.com",
  messagingSenderId: "198098990583",
  appId: "1:198098990583:web:e575251009a4e00458aaf2",
  measurementId: "G-QN0YYMYLSC"
};

// Initialize Firebase
export const app = initializeApp({ ...firebaseConfig })
export const auth = getAuth(app)
export const firestore = getFirestore(app)
// const analytics = getAnalytics(app);

// Auth exports

// export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Firestore exports

// export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
// export const fromMillis = firebase.firestore.Timestamp.fromMillis;
// export const increment = firebase.firestore.FieldValue.increment;
