import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { INotification, Notifikasi} from "../models/notification";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";
import agent from "../api/agent";

export default class NotificationStore {
    notifications: INotification[] = []
    hubConnection: HubConnection | null = null;

    constructor()
    {
        makeAutoObservable(this)
    }

    createHubConnection = () => {
        if (store.userStore.user) {
            this.hubConnection = new HubConnectionBuilder()
        .withUrl(`http://localhost:5000/notification`,{
            accessTokenFactory: () => store.userStore.user?.token as string
        }).withAutomaticReconnect().configureLogging(LogLevel.Information).build();

        this.hubConnection.start().catch(err => console.log(err)
        )

        this.hubConnection.on("LoadNotification", (notifications:Notifikasi[]) => {
            runInAction(() => {
               this.notifications = notifications;                
            })
        })
        this.hubConnection.on("ReceiveNotif", (notification : Notifikasi) => {
            runInAction(() => {
                var result =this.notifications.some(e => e.id == notification.id)
                if (!result) {
                    this.notifications.unshift(notification)
                    console.log(notification);
                    
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
          ?.invoke("Send", value)
          .catch((err) => console.log(err));
    }

    loadNotifications = async() => {
        try {
            var result = await agent.Notifications.get();
            this.notifications = result
        } catch (error) {
            console.log(error);
                        
        }
    }
}