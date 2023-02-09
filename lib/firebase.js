import { ConstructionOutlined } from "@mui/icons-material";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  getCountFromServer,
  query,
  documentId,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { tutorialDoc } from "@/components/ExampleDocs";

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

async function isNewUser(userUid) {
  const snap = await getCountFromServer(
    query(collection(db, "users"), where(documentId(), "==", userUid))
  );
  return snap.data().count == 0;
}

export async function setUpUserAndDocs({ documents, setDocuments, setUser }) {
  const signInRef = await signInAnonymously(auth);
  console.log("User ID: ", signInRef.user.uid);
  onAuthStateChanged(auth, (authUser) => {
    setUser(authUser);
    const uid = authUser.uid;
    console.log("User ID again: ", uid);
    isNewUser(uid).then((value) => {
      if (value) {
        console.log("Creating documents");
        setDoc(doc(db, "users", uid), {});
        saveDocumentsFirestore({ uid, documents: [tutorialDoc], setDocuments });
        // console.log(documents) // this is still blank - because above is async?!
      } else {
        console.log("Getting documents");
        getDocs(
          query(collection(db, "users", uid, "code"), orderBy("createdAt"))
        ).then((querySnapshot) => {
          setDocuments(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
      }
    });
  });
}

export async function saveDocumentsFirestore({ uid, documents, setDocuments }) {
  // TODO: separate setDocuments from this
  // wait for all documents to be updated / added before setDocuments,
  //  otherwise the promise is set as document!
  Promise.all(
    documents.map(async (d) => {
      if (d.id) {
        return setDoc(doc(db, "users", uid, "code", d.id), d.data).then(() => {
          console.log("Document updated: ", d.id);
          return d;
        });
      } else {
        // The 1st return returns the Promise returned by the addDoc() function.
        return addDoc(collection(db, "users", uid, "code"), d.data).then(
          (docRef) => {
            console.log("Document added: ", docRef.id);
            // The 2nd return, inside .then(), executes after above promise resolves.
            //  This actually returns the object.
            return { ...d, id: docRef.id };
          }
        );
      }
    })
  ).then((results) => {
    setDocuments(results);
  });
}

export async function deleteDocumentFirestore({ uid, docId }) {
  deleteDoc(doc(db, "users", uid, "code", docId)).then(() => {
    console.log("Document deleted: ", docId);
  });
}
