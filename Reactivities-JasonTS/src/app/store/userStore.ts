import { makeAutoObservable } from "mobx";
import { User } from "../models/user";
import { getCurrentUser } from "../api/api";
import { Store } from "./store";
import { router } from "../router/router";

export default class UserStore {
  user: User | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  get IsLoggedIn() {
    return !!this.user;
  }

  getUser = async () => {
    try {
      const user = await getCurrentUser();
      Store.conversationStore.createHubConnection();
      this.user = user;
    } catch (error) {
      console.error(error);
    }
  };

  logout = () => {
    Store.commonStore.setBearer(null);
    (this.user = null), router.navigate("/");
  };
}
