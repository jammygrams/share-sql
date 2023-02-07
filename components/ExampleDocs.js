import { serverTimestamp } from "firebase/firestore";

export const tutorialDoc = {
  // created in firebase so don't need id structure
    content: "SELECT this, that FROM table1 WHERE that == '9'",
    summary: "Return all this where that equals 9",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
export const newDoc = {
  // created in app so need id structure
    id: null,
    data: {
      content: "",
      summary: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  };