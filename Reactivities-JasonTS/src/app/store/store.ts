import { createContext, useContext } from "react";
import ModalStore from "./modalStore";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import ActivityStore from "./activityStore";
import ProfileStore from "./profileStore";
import CommentStore from "./commentStore";

interface Store {
    modalStore : ModalStore;
    userStore: UserStore;
    commonStore : CommonStore
    activityStore: ActivityStore,
    profileStore : ProfileStore,
    commentStore : CommentStore
}

export const Store : Store = {
    modalStore: new ModalStore(),
    userStore : new UserStore(),
    commonStore : new CommonStore(),
    activityStore : new ActivityStore(),
    profileStore : new ProfileStore(),
    commentStore: new CommentStore()
}

export const StoreContext = createContext(Store)

export function useStore()
{
    return useContext(StoreContext);
}