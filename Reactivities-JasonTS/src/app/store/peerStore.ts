import Peer, { MediaConnection } from "peerjs";
import { Store } from "./store";
import { makeAutoObservable } from "mobx";

export default class PeerStore {
  peer: Peer | null = null;
  userCall: UserCall | null = null;
  peerCall: MediaConnection | null = null;
  currentMediaStream: MediaStream | null = null;
  userMediaStream: MediaStream | null = null;
  AcceptCall: boolean = false;
  onCallUser: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }

  get getPeer() {
    return this.peer;
  }

  newPeer = () => {
    this.peer = new Peer(Store.userStore.user?.id!, {
      host: "localhost",
      port: 9000,
      path: "/",
    });
  };

  // callUser = (id: string) => {
  //   console.log(this.peer);

  //   const conn = this.peer?.connect(id);
  //   conn?.on("open", () => {
  //     conn.send("Succces Connection");
  //   });
  //   conn?.on("error", () => {
  //     console.log("error");
  //   });
  //   console.log(conn);
  // };
}
