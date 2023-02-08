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

export async function createUserAndDoc({ firstDoc }) {
  const signInResult = await signInAnonymously(auth);
  const userUid = signInResult.user.uid;
  const userDoc = {};
  console.log("User ID: ", userUid);
  try {
    if (isNewUser(signInResult.user)) {
      await setDoc(doc(db, "users", userUid), userDoc);
      const docId = await addDoc(
        collection(db, "users", userUid, "code"),
        firstDoc
      );
      console.log("Added tutorial doc id: ", docId.id);
    }
    return signInResult.user;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}

export async function saveDocumentsFirestore({ uid, documents, setDocuments }) {
  // wait for all documents to be updated / added before setDocuments,
  //  otherwise the promise is set as document!
  Promise.all(documents.map((d) => {
    if (d.id) {
      return setDoc(doc(db, "users", uid, "code", d.id), d.data).then(() => {
        console.log("Document updated: ", d.id);
        return d;
      })
    } else {
      // The 1st return returns the Promise returned by the addDoc() function. 
      return addDoc(collection(db, "users", uid, "code"), d.data)
      .then((docRef) => {
        console.log("Document added: ", docRef.id);
        // The 2nd return, inside .then(), executes after above promise resolves.
        //  This actually returns the object.
        return { ...d, id: docRef.id};
      });
    }
  })).then((results) => {setDocuments(results)});
}
