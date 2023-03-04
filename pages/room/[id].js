import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Editor from "../../components/Editor";
import { addRoomToUser } from "../../lib/firebase";
import { UserContext } from "../../lib/context";

export default function EditorRoom() {
  const { user, username } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;
  const roomId = id

  useEffect(() => {
    async function initialize() {
      try {
        const uid = user.uid;
        await addRoomToUser({ uid, roomId });
      } catch (error) {
        console.error(error);
      }
    }
    initialize();
  }, []);

  return <Editor roomId={roomId} username={username} />
}
