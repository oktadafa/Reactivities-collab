import { makeAutoObservable, reaction, runInAction } from "mobx"
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";
import { profile } from "console";

export default class ActivityStore {
    activities: Activity[] = []
    activityRegistry = new Map<String, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);
    loadingKick = false;
    loadingAddUser = false;
    constructor() {
        makeAutoObservable(this)

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activityRegistry.clear();
                this.loadActivities();
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((/*value,*/ key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            })
        }
        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((values, key) => {
            if (key === 'startDate') {
                params.append(key, (values as Date).toISOString())
            } else {
                params.append(key, values);
            }
        })
        return params;
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                if(!activity.isPrivate)
                {
                    const date = format(activity.date!, 'dd MMM yyyy ');
                    activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                }
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial (true);
        try {
            const result = await agent.Activities.list(this.axiosParams);
                result.data.forEach(activity => {
                    this.setActivity(activity);
            })
            this.setPagination(result.pagination);
            this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
                this.setLoadingInitial(false);
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity
            return activity;
        }
        else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            )
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        // this.loading  = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
                // this.editMode = false;
                // this.loading = false;
            })
        }catch (error) {
            console.log(error);
            // runInAction(() => {
            //     this.loading = false;
            // })
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        // this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    const updatedActivity = {...this.getActivity(activity.id), ...activity}; //di video suruh pake const karena gapelru reassign lagi besok di video pake let
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
                // this.editMode = false;
                // this.loading = false;
            })

        }catch (error) {
            console.log(error);
            // runInAction(() => {
            //     this.loading = false;
            // })
        }
    }
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
       
    }   

        updateAttendance = async () => {
            const user = store.userStore.user;
            this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
                        a => a.username !== user?.username)
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        }catch (error) {
            console.log(error);
        }finally{
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.username === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                    
                }
            })
        })
    }

    kickUserActivity = async(username:string) => {
        this.loadingKick = true
        try {
            await agent.Activities.kick(this.selectedActivity?.id || '', username);
            runInAction(() => {
                if (this.selectedActivity?.attendees) {
                    this.selectedActivity.attendees = this.selectedActivity?.attendees.filter(e => e.username != username);
                }
                this.loadingKick =false
            })
        } catch (error) {
            runInAction(() => this.loadingKick = false)
        }        
    }

    addUserActivity = async(userrname:string) => {
        this.loadingAddUser = true;
        try {
            await agent.Activities.addAttend(this.selectedActivity?.id || '', userrname);
            runInAction(async () => {
                if(this.selectedActivity?.attendees)
                {
                    await store.profileStore.loadProfile(userrname)
                   const user = store.profileStore.profile
                   if (user) {
                       this.selectedActivity.attendees.push(user);
                       store.profileStore.followings = store.profileStore.followings.filter(e => e.username !== user.username);                
                   }
                }                
            })
            this.loadingAddUser =false
        } catch (error) {
            this.loadingAddUser =false
            console.log("function addUserActivity error cuy");
            
        }
    }
}


