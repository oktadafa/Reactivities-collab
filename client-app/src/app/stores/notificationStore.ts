import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import {  Notifikasi} from "../models/notification";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";
import agent from "../api/agent";
import { router } from "../router/Routes";

export default class NotificationStore {
    notifications: Notifikasi[] = []
    hubConnection: HubConnection | null = null;

    constructor()
    {
        makeAutoObservable(this)
    }

    createHubConnection = () => {
        if (store.userStore.user) {
            this.hubConnection = new HubConnectionBuilder()
              .withUrl(import.meta.env.VITE_NOTIFICATION_URL, {
                accessTokenFactory: () => store.userStore.user?.token as string,
              })
              .withAutomaticReconnect()
              .configureLogging(LogLevel.Information)
              .build();

        this.hubConnection.start().catch(err => console.log(err)
        )

        this.hubConnection.on("LoadNotification", (notifications:Notifikasi[]) => {
            runInAction(() => {
               this.notifications = notifications;
               console.log(notifications);                      
            })
        })

        this.hubConnection.on("DeleteFollow", (username:string) => {
            runInAction(() => {
                this.notifications = this.notifications.filter(e => e.from !== username)                               
            })
        })

        this.hubConnection.on("ReceiveNotif", (notification : Notifikasi) => {
            runInAction(() => {
                console.log(notification);
                
                if(notification.from !== store.userStore.user?.displayName)
                {
                    var result = this.notifications.some((e) => e.id == notification.id);
                    if (!result) {
                        notification.date = new Date(notification.date).toLocaleString()
                    this.notifications.unshift(notification);
                    }
                }
            })
        })
        }
    }

    sendNotification = async(message:string, username:string) => {
        var value = {
            Username : username,
            Message : message
        }
        console.log(this.hubConnection?.invoke);
        
        await this.hubConnection
          ?.invoke("Send", value).then(err => console.log(err)
          )
          .catch((err) => console.log(err));
    }

    loadNotifications = async() => {
        try {
            var result = await agent.Notifications.get();
            this.notifications = result
              console.log(this.notifications);
            
        } catch (error) {
            console.log(error);
                        
        }
    }

    unfollowToggle = async(From:string, To:string) => {
        try {
        var value = {
            From : From,
            To : To
        }
        console.log(value);
        
        await this.hubConnection?.invoke("Delete", value).catch(err => console.log(err)
        )    
        } catch (error) {
         console.log(error);
           
        }
        
    }

    updateNotification = async(id:number, username:string, isRead:boolean) => {
        try {
            if (isRead) {
                router.navigate(`/profiles/${username}`);
            }
            await agent.Notifications.update(id)    
            runInAction(() => {
                this.notifications = this.notifications.map(e => {
                    if (id == e.id) {
                     e.isRead = true
                    }
                    return e;
                })
                router.navigate(`/profiles/${username}`)
            })   
        } catch (error) {
            console.error(error)
        }
    }
}