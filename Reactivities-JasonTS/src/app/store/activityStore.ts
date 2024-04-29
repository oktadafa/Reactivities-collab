import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import { Store } from "./store";
import { format } from "date-fns";import { Profile } from "../models/profile";
import { Pagination } from "../models/pagination";

export default class ActivityStore {

  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  activitRegistry = new Map<String, Activity>();
  loadingAttendee:boolean = false;
  pageSize :number = 2
  hasNextPage:boolean = false
  pageNumber:number = 1
  constructor() {
    makeAutoObservable(this);
  }

  // loadActivities =  ( ) => {
  //   try {
  //     const {data} =  useQueryActity()
  //     console.log(data);
      
  //     data?.items.forEach(activiti => {
  //       this.setActivity(activiti)
  //     })
  //   } catch (error) {
  //     console.log(error);
      
  //   }
  // }
  nextPagination(){
    this.pageNumber+=1
  }

  saveActivities = (data: Pagination) => {
    try {
        this.pageNumber = data.pageNumber;
        this.pageSize = data.totalPages;
      this.activities = data.items;
      this.hasNextPage = data.hasNextPage;
      
      this.activities.forEach((e) => {
        this.setActivity(e);
      });
    } catch (error) {
      console.log(error);
    }
  };

  saveActivity = (activity:Activity) => {
    try {
      runInAction(() => {
        this.setActivity(activity)
        this.selectedActivity = activity;
      })
      return activity;
    } catch (error) {
      console.log(error);
    }
  }

  private setActivity = (activity: Activity) => {
    const user = Store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.username === user.userName
      );
      activity.isHost = activity.hostUsername === user.userName;
      activity.host = activity.attendees?.find(
        (x) => x.username === activity.hostUsername
      );
    }
    activity.date = new Date(activity.date!);
        this.activitRegistry.set(activity.id, activity);
    console.log(this.activitRegistry.size);
    
  };

  get activitiesByDate() {
    return Array.from(this.activitRegistry.values()).sort();
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        if (!activity.isPrivate) {
          const date = format(activity.date!, "dd MMM yyyy ");
          activities[date] = activities[date]
            ? [...activities[date], activity]
            : [activity];
        }
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  getActivityById = (id:string) => {
    var activity = this.activitRegistry.get(id);
    this.selectedActivity = activity;
  }

  updateAttende = () => {
    const user = Store.userStore.user;
    console.log("test");
    
    try {
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (a) => a.username !== user?.userName
            );
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activitRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      })
    } catch (error) {
    console.log(error);
    }
  }
}