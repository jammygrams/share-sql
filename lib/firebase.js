import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
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
    isNewUser(uid).then((value) => {
      if (value) {
        console.log("Creating documents");
        setDoc(doc(db, "users", uid), {});
        addDoc(collection(db, "users", uid, "code"), tutorialDoc.data).then(
          (docRef) => {
          setDocuments([...documents, {...tutorialDoc, id: docRef.id}]);
        });
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

export async function saveDocumentsFirestore({ uid, documents }) {
  // wait for all documents to be updated / added before setDocuments,
  //  otherwise the promise is set as document!
  const promises = documents.map(async (d) => {
    return saveDocumentFirestore({ uid, document: d }); // need to return these promises!
  });
  return Promise.all(promises);
}

export async function saveDocumentFirestore({ uid, document }) {
    return setDoc(doc(db, "users", uid, "code", document.id), document.data).then(
      () => {
        console.log("Document updated: ", document.id);
      }
    );
  }

export async function deleteDocumentFirestore({ uid, docId }) {
  deleteDoc(doc(db, "users", uid, "code", docId)).then(() => {
    console.log("Document deleted: ", docId);
  });
}
