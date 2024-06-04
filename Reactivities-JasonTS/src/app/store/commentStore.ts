import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import ChatComment from "../models/comment";
import { makeAutoObservable } from "mobx";
import { Store } from "./store";
import Swal from "sweetalert2";

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;
  image: string = "";

  constructor() {
    makeAutoObservable(this);
  }
  show(id: string) {
    this.comments.find((e) => e.id == id)!.showReply = !this.comments.find(
      (e) => e.id == id
    )!.showReply;
  }

  createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_CHAT_URL + "?activityId=" + activityId, {
        accessTokenFactory: () =>
          Store.commonStore.bearer?.accessToken as string,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection.start();
    this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
      this.comments = comments;
    });
    this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
      if (comment.commentParentId == "00000000-0000-0000-0000-000000000000") {
        this.comments.unshift(comment);
      } else {
        this.comments.forEach((element) => {
          if (element.id == comment.commentParentId) {
            element.replyComments.unshift(comment);
          }
        });
      }
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

    try {
      await this.hubConnection?.invoke("SendComment", values);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "sorry there's a problem",
        icon: "error",
      });
    }
  };
}
