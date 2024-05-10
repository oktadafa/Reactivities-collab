import Peer from "peerjs";
import { useEffect, useState } from "react";
import UserStore from "../../store/userStore";
import { Store, useStore } from "../../store/store";

export default function Video() {
  const [peerId, setPeerId] = useState<string>("");
  const [peer, setPeer] = useState<Peer | null>(null);
  const [inputId, setInputId] = useState("");
  useEffect(() => {
    const peer2 = new Peer(Store.userStore.user?.id!);
    // peer2.on("open", (id: string) => {
    // setPeerId(id);
    // });
    peer2.on("connection", (conn) => {
      conn.on("data", (data) => {
        console.log(data);
      });
    });
    peer2.on("error", (err) => {
      console.log(err);
    });
    // console.log(peer);
    setPeer(peer2);
  }, []);

  const connect = (id: string) => {
    const conn = peer?.connect(id);
    conn?.send("okta");
    conn?.on("open", () => {
      conn.send("dafa");
    });

    conn?.on("data", (data: any) => {
      console.log(data);
    });
  };

  return (
    <div className="w-screen h-screen flex justify-evenly items-center">
      <p>Your id {Store.userStore.user?.id}</p>
      <input type="text" onChange={(e) => setInputId(e.target.value)} />
      <button onClick={() => connect(inputId)}>input</button>
      <div className="p-20 bg-red-500 inline-block"></div>
      <div className="p-20 bg-red-500 inline-block"></div>
    </div>
  );
}
