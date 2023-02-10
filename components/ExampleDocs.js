import { serverTimestamp } from "firebase/firestore";

const tutorialSQL = `SELECT DISTINCT ON (customer)
  id, customer, total
FROM purchases
ORDER BY customer, total DESC, id;`

const tutorialSummary = "Select the highest purchase total for each customer."

export const tutorialDoc = {
  id: null,
  data: {
    content: tutorialSQL,
    summary: tutorialSummary,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
};

export const newDoc = {
  id: null,
  data: {
    content: "",
    summary: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
};
