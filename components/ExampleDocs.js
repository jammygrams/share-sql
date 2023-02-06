import { serverTimestamp } from "firebase/firestore";

export const tutorialDoc = {
    content: "SELECT this, that FROM table1 WHERE that == '9'",
    summary: "Return all this where that equals 9",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
export const newDoc = {
    code: "",
    summary: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };