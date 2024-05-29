import { createContext, useContext } from "react";
import ModalStore from "./modalStore";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import ActivityStore from "./activityStore";
import ProfileStore from "./profileStore";
import CommentStore from "./commentStore";
import ConversationStore from "./conversationStore";
import PeerStore from "./peerStore";

interface Store {
  modalStore: ModalStore;
  userStore: UserStore;
  commonStore: CommonStore;
  activityStore: ActivityStore;
  profileStore: ProfileStore;
  commentStore: CommentStore;
  conversationStore: ConversationStore;
  peerStore: PeerStore;
}

export const Store: Store = {
  peerStore: new PeerStore(),
  modalStore: new ModalStore(),
  userStore: new UserStore(),
  commonStore: new CommonStore(),
  activityStore: new ActivityStore(),
  profileStore: new ProfileStore(),
  commentStore: new CommentStore(),
  conversationStore: new ConversationStore(),
};

export const StoreContext = createContext(Store);

export function useStore() {
  return useContext(StoreContext);
}
