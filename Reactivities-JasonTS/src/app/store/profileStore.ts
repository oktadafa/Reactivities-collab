import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile, Tab } from "../models/profile";
import { Store } from "./store";

export default class ProfileStore {
  activeTab: Tab | undefined = undefined;
  profile: Profile | null = null;
  following: Profile[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  get isCurrentUser() {
    if (Store.userStore.user && this.profile) {
      return Store.userStore.user.userName === this.profile.username;
    }
    return false;
  }

  saveProfile(profile: Profile) {
    this.profile = profile;
  }
  saveFollowing(follow: Profile[]) {
    this.following = follow;
  }

  setActiveTab(tab: Tab) {

    this.activeTab = tab;
  }
  handleUpdateFollow(profil: Profile, following: boolean) {
    if (
      this.profile &&
      this.profile.username !== Store.userStore.user?.userName &&
      this.profile.username == profil.username
    ) {
      if (following) {
        this.profile.followersCount--;
      } else {
        this.profile.followersCount++;
      }

      this.profile.following = !this.profile.following;
    }
    if (
      this.profile &&
      this.profile.username == Store.userStore.user?.userName
    ) {
      following ? this.profile.followingCount-- : this.profile.followingCount++;

      this.profile.following = !this.profile.following;
    }

    this.following.forEach((profile) => {
      if (profile.username === profil.username) {
        profile.following ? profile.followersCount-- : profile.followersCount++;
        profile.following = !profile.following;
      }
    });
  }

}