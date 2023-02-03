import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1F8fCJfkoCI2m6d6RTaKjl5hwrgJKsiQ",
  authDomain: "share-sql.firebaseapp.com",
  projectId: "share-sql",
  storageBucket: "share-sql.appspot.com",
  messagingSenderId: "198098990583",
  appId: "1:198098990583:web:e575251009a4e00458aaf2",
  measurementId: "G-QN0YYMYLSC",
};

export const app = initializeApp({ ...firebaseConfig });
export const auth = getAuth(app);
export const db = getFirestore(app);

function isNewUser(user) {
  const threshold = 500;
  return (
    Math.abs(user.metadata.lastSignInTime - user.metadata.creationTime) >
    threshold
  );
}

export async function createUser({ firstDoc }) {
  const signInResult = await signInAnonymously(auth);
  const userUid = signInResult.user.uid; // The UID of the user.
  const userDoc = {};
  console.log("User ID: ", userUid);
  try {
    await setDoc(doc(db, "users", userUid), userDoc);
    if (isNewUser(signInResult.user)) {
      const docId = await addDoc(
        collection(db, "users", userUid, "code"),
        firstDoc
      );
      console.log("Added tutorial doc id: ", docId.id);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
