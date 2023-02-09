import { serverTimestamp } from "firebase/firestore";

export const tutorialDoc = {
  id: null,
  data: {
    content: `
      SELECT DISTINCT ON (customer)
        id, customer, total
      FROM purchases
      ORDER BY customer, total DESC, id;`,
    summary: "Select the highest purchase total for each customer.",
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
