import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getCountFromServer,
  query,
  documentId,
  where,
  getDoc,
  arrayUnion,
} from "firebase/firestore";

import { firebaseConfig } from "../firebase.config";

export const app = initializeApp({ ...firebaseConfig });
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function isNewUser(userUid) {
  const snap = await getCountFromServer(
    query(collection(db, "users"), where(documentId(), "==", userUid))
  );
  return snap.data().count == 0;
}

export async function anonSignIn() {
  const signInRef = await signInAnonymously(auth);
  //   console.log("User ID: ", signInRef.user.uid);
  // onAuthStateChanged is in function so can await it
  const authUser = await new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error("User not found"));
      }
    });
  });
  return authUser;
}

export async function createNewUser(uid) {
  const username = `User${uuidv4().substring(0, 4)}`;
  const firstData = { rooms: [], uid: uid, username: username };
  console.log(`Creating user ${username}`);
  await setDoc(doc(db, "users", uid), firstData);
  return username;
}


export async function addRoomToUser({ uid, roomId }) {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    rooms: arrayUnion(roomId),
  });
  console.log(`Added room ${roomId} to User ${uid}`);
}

export async function getUserData(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return data;
}

export async function deleteDocumentFirestore({ uid, docId }) {
  await deleteDoc(doc(db, "users", uid, "code", docId));
  console.log("Document deleted: ", docId);
}
