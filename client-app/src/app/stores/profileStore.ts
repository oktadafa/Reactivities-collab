import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile, userActivity } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    buttonAdd = false
    activeTab = 0;
    userActivities: userActivity[] = [];
    loadingActivities = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if(activeTab === 3 || this.activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                    this.buttonAdd = false
                } else {
                    this.followings = [];
                }
            }
        )
    }
    
    setActiveTab = (activeTab: number) => {
    this.activeTab = activeTab;   
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        }catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
            
        }
    }

    uploudPhoto  = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploudPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if(photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url
                    }   
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo ) => {
        this.loading = true;
        try {  
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = this.profile.photos.find(x => x.isMain == true)?.url
                this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id)
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username).catch(err => console.log(err)
            );
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(async() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
                    if (following) {
                        this.profile.followersCount++;
                       await store.notificationStore.sendNotification("Follow You", username).then(p => console.log(`Anda Diffolow ${p}`)).catch(p => console.log(`Error ${p}`)
                        )
                    } else {
                        this.profile.followersCount--;
                    }
                    // following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                    this.loading = false;
                }
                if (this.profile && this.profile.username === store.userStore.user?.username) {
                    if (following) {
                      this.profile.followersCount++;
                     await store.notificationStore
                        .sendNotification("Follow You", username)
                        .then((p) => console.log(`Anda Diffolow ${p}`))
                        .catch((p) => console.log(`Error ${p}`));
                    } else {
                      this.profile.followersCount--;
                    }
                    // following ? this.profile.followingCount++ : this.profile.followingCount--;
                    this.profile.following = !this.profile.following
                }
                // this.following = !this.following;
                
                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                        this.loading = false;
                    }
                })
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }
    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            })
        } catch (error) {
            console.log(this.profile?.username);
            runInAction(() => this.loadingFollowings = false);
            
        }
    }

    loadUserActiviies = async (username: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            const activities = await agent.Profiles.listActivities(username, predicate!);
           console.log(predicate!);
           
            
            
            runInAction(() => {
                this.userActivities = activities;
                this.loadingActivities = false;
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loadingActivities = false;
            })
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        this.loading = true;
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName)
                }
                this.profile = {...this.profile, ...profile as Profile};
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    loadFollowers = async() => {
        try {
            const user =store.userStore.user
            const activity =store.activityStore.selectedActivity
            if (user?.username) {
                const pengikut = await agent.Profiles.listFollowings(user.username, "followers");
                console.log(pengikut);
                runInAction(() => {
                const followersNotInActivity = pengikut.filter(pengikut => !activity?.attendees.some(attendee => attendee.username === pengikut.username));
                    this.followings = followersNotInActivity
                })
            }
        } catch (error) {
            console.log(error);
                        
        }
    }



}