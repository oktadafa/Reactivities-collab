import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import ChatComment from "../models/comment";
import { makeAutoObservable } from "mobx";
import { Store } from "./store";

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;
  image: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:5001/chat?activityId=" + activityId, {
        accessTokenFactory: () =>
          Store.commonStore.bearer?.accessToken as string,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then((data) => console.log(data))
      .catch((error) => console.log(error, "Waduh Error"));
    this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
      this.comments = comments;
      console.log(comments);
      
    });
    this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
      this.comments.unshift(comment);
    });
  };

  stopHubConnection = () => {
    this.hubConnection
      ?.stop()
      .catch((error) => console.log("Error stopping the connection: ", error));
  };

  clearComments = () => {
    this.comments = [];
    this.stopHubConnection();
  };

  addComent = async (values: any, activityId: string) => {
    values.activityId = activityId;
    console.log(values);

    try {
      await this.hubConnection
        ?.invoke("SendComment", values)
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };
}
