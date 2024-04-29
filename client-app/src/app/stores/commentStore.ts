import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ChatComment from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";
import agent from "../api/agent";

export default class CommentStore{
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;
    image: string = "";

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
            this.hubConnection.on('ReceiveComment',async (comment: ChatComment) => {
                try {  
                if(this.image)
                {
                    comment.commentImage = this.image
                     agent.Activities.uploadPhotoChat(comment).then(_ => 
                runInAction(() => {
                  comment.createdAt = new Date(comment.createdAt);
                  this.comments.push(comment);
                }));
                }
                else{
                     runInAction(() => {
                       comment.createdAt = new Date(comment.createdAt);
                       this.comments.push(comment);
                     });
                }
                   
                } catch (error) {
                   console.log(error);
                    
                }
                
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

    addComment = async (values: any, file:File) => { 
        values.activityId = store.activityStore.selectedActivity?.id;
        if(file){
            this.image = await this.convertImage(file);
        }
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

    convertImage = (image : File):Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
    }
    
}  
