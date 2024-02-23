import {  makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../models/activities"
import { agent } from "../api/agen";
import {v4 as uuid} from 'uuid'
import { format } from "date-fns";
export default class ActivityStore {
    activity : Activity | undefined = undefined
    activityREgistry = new Map<string, Activity>()
    editModal = false;
    loadingUpdate = false;
    laodinDelete = false
    loadingInitial = false;
    constructor()
    {
        makeAutoObservable(this)
    }

get ActivitiesByDate()
{
    return Array.from(this.activityREgistry.values()).sort((a,b) => a.date!.getTime() - b.date!.getTime())
}

get groupActivities() {
    return Object.entries(
        this.ActivitiesByDate.reduce((activities, activity) => {
            const date = format(activity.date!,'dd MMM yyyy');
            activities[date] = activities[date] ? [...activities[date],activity] : [activity] ;
             return activities;
        },{} as {[key:string] : Activity[]})
    )
}
    loadingActivies = async() => {
     this.loadingInitial = true;
     try {
        const activities = await agent.Activities.list()
        
            activities.forEach((activit) => {             
                this.setActivity(activit)
            });
            this.loadingInitial = false;
            
    } catch (error) {
        console.log(error);
        this.loadingInitial = false;        
     }
    }

    loadActivity = async (id:string) => {
        let activity = this.getActivity(id)
        if (activity) {
            this.activity = activity;
            return activity;
        }else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                this.activity= activity;
                this.setLoadingInitial(false)
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false)
            }
        }
    }

    private setActivity = (activity:Activity) => {
          activity.date = new Date(activity.date!)
          //   this.activities.push(activit);
          this.activityREgistry.set(activity.id, activity);
    }

    private getActivity = (id:string) => {
        return this.activityREgistry.get(id);
    }

    setLoadingInitial = (state:boolean) => {
        this.loadingInitial = state
    }

    createActivity = async(activity:Activity) => {
        this.loadingUpdate = true
        activity.id = uuid()
        try {
            await agent.Activities.create(activity)
            runInAction(() => {
                this.activityREgistry.set(activity.id, activity);
                this.activity = activity;
                this.editModal = false;
                this.loadingUpdate = false;
            })       
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingUpdate =false
            })
        }
    }

    updateActivity = async (activity : Activity) => {
        this.loadingUpdate= true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
               this.activityREgistry.set(activity.id, activity) 
               this.activity = activity;
               this.editModal = false;
               this.loadingUpdate= false;

            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingUpdate= false
            })
            
        }
    }

    handleDelete = async (id:string) => {
        this.laodinDelete =true
        try {
            await agent.Activities.delete(id)
            runInAction(() => {
                this.activityREgistry.delete(id);
                    this.laodinDelete = false
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.laodinDelete = false
            })            
        }
    }
}