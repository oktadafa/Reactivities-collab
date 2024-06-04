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
      host: import.meta.env.VITE_PEER_HOST,
      port: 9000,
      path: "/",
    });
  };
}
