import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  documents: null,
  setDocuments: () => {},
});
