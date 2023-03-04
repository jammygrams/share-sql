import React, { useEffect, useContext } from "react";
import Router from "next/router";
import {
  isNewUser,
  getUserData,
  addRoomToUser,
} from "../lib/firebase.js";
import Loader from "../components/Loader";
import { UserContext } from "../lib/context";

export default function Home() {
  const { user, username } = useContext(UserContext);
  let roomId = null;

  useEffect(() => {
    async function initialize() {
      try {
        const uid = user.uid;
        if (await isNewUser(uid)) {
          roomId = uuidv4();
          await addRoomToUser({ uid, roomId });
        } else {
          const userData = await getUserData(uid);
          roomId = userData.rooms[0];
          console.log("Getting room", roomId);
        }
        const { pathname } = Router;
        if (pathname == "/") {
          Router.push(`/room/${roomId}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
    initialize();
  }, []);

  return (
    <>
      <Loader show />
    </>
  );
}
