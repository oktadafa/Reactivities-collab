import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ChatComment from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore{
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        console.log("okta");
            if (store.activityStore.selectedActivity) {
                
                this.hubConnection = new HubConnectionBuilder()
                .withUrl(import.meta.env.VITE_CHAT_URL + '?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token as string
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            
            this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error)).then(err => console.log(err)
            );

            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() =>  {
                    comments.forEach(comment => {                        
                        comment.createdAt = new Date(comment.createdAt);

                    })
                    this.comments = comments
                });    
            })
            this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
                console.log("test");
                
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt)
                    this.comments.push(comment)
                    
                });
            })

            this.hubConnection.on("DeleteComment", (commentId:number) => {
                runInAction(() => {
                    this.comments =this.comments.filter(e => e.id != commentId)
                })
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping the connection: ', error));
    } 

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => { 
        values.activityId = store.activityStore.selectedActivity?.id;
        
        try {         
            await this.hubConnection?.invoke('SendComment', values).then(err => console.log(err)
            );
        } catch (error) {
            console.log(error);
        }
    }

    deleteComment = async(commentId : number) => {
        let values = 
        {
            commentId :commentId,
            activityId : store.activityStore.selectedActivity?.id
        }
        try {
            await this.hubConnection?.invoke("DeleteComment", values);
        } catch (error) {
            console.log(error);
            
        }
    }
    
}  
