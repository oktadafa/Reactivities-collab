import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { Store } from "./store";
import { format } from "date-fns";
import Peer from "peerjs";

export default class ConversationStore {
  selectedParticipants: Participant | null = null;
  hubConnection: HubConnection | null = null;
  ProfileMessage: ProfileMessage | null = null;
  Conversation: Conversation[] = [];
  laodignChat: boolean = false;
  loadingConversation: boolean = false;
  selectedUsername: string | null = null;
  CountNewMessage: number = 0;
  peer: Peer | undefined = undefined;
  stream: MediaStream | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  getStream = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((data) => (this.stream = data));
  };
  showOption = (id: string) => {
    const message = this.ProfileMessage?.messages.find((x) => x.id === id);
    if (message) {
      message.showOptions = !message.showOptions;
    }
  };
  createHubConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:5001/conversation", {
        accessTokenFactory: () =>
          Store.commonStore.bearer?.accessToken as string,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then((data) => console.log(data))
      .catch((err) => console.error(err))
      .finally(() => (this.loadingConversation = true));

    this.hubConnection.on("LoadConversation", (data: Conversation[]) => {
      runInAction(() => {
        this.Conversation = data;
        this.Conversation.forEach((e) => {
          this.CountNewMessage += e.noReadCount;
        });
        console.log(data);
        this.Conversation.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loadingConversation = false;
      });
    });

    this.hubConnection.on("ReceiveMessage", (data: Messages) => {
      runInAction(() => {
        this.CountNewMessage += 1;
        const checkConversation = this.Conversation.some(
          (e) => e.username == data.fromUsername
        );
        if (!checkConversation) {
          const conversation: Conversation = {
            displayName: data.fromDisplayName!,
            username: data.fromUsername,
            image: data.image!,
            message: data.body,
            createdAt: data.createdAt,
            isRead: false,
            fromUsername: data.fromUsername,
            noReadCount: 1,
            file: data.file?.name!,
            fileType: data.file?.contentType!,
          };
          this.Conversation.push(conversation);
          console.log(conversation);
        }
        const check = this.ProfileMessage?.messages.some(
          (x) => x.id == data.id
        );
        if (!check) {
          // if (this.ProfileMessage?.userName == data.fromUsername) {
          //   this.ProfileMessage?.messages.push(data);
          // }

          this.Conversation.forEach((e) => {
            if (e.username == data.fromUsername) {
              e.message = data.body;
              e.createdAt = data.createdAt;
              e.isRead = false;
              e.noReadCount += 0.5;
              (e.file = data.file?.name!),
                (e.fileType = data.file?.contentType!);
            }

            if (this.ProfileMessage?.userName == data.fromUsername) {
              if (e.fromUsername == this.ProfileMessage.userName) {
                e.isRead = true;
                this.hubConnection?.invoke("ReadMessage", data);
              }
            }
          });
        }
        this.Conversation.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    });

    this.hubConnection.on("ListMessage", (list: ProfileMessage) => {
      runInAction(() => {
        this.ProfileMessage = list;
        this.Conversation.forEach((e) => {
          if (e.fromUsername == list.userName) {
            e.noReadCount = 0;
            e.isRead = true;
          }
        });
        this.laodignChat = false;
      });
    });

    this.hubConnection.on("ReadMessage", (conversation: Conversation) => {
      runInAction(() => {
        console.log(conversation);
        // this.Conversation.for
        // this.Conversation.forEach(e => {
        //     if(e.username == conversation.fromUsername){
        //       e.isRead = true
        //     }
        // })

        if (this.ProfileMessage?.userName == conversation.username) {
          this.ProfileMessage.messages.forEach((e) => {
            if (e.fromUsername == conversation.fromUsername && !e.isRead) {
              e.isRead = true;
            }
          });

          this.Conversation.forEach((e) => {
            if (e.username == conversation.username) {
              e.noReadCount = 0;
              e.isRead = true;
            }
          });
        }

        if (this.ProfileMessage?.userName == conversation.fromUsername) {
          this.ProfileMessage.messages.forEach((e) => {
            if (e.fromUsername == conversation.username && !e.isRead) {
              e.isRead = true;
            }
          });

          this.Conversation.forEach((e) => {
            if (e.fromUsername == conversation.username) {
              e.isRead = true;
              e.noReadCount = 0;
            }
          });
        }
      });
    });
  };
  setSelectedUser = (username: string) => {
    this.selectedUsername = username;
    this.listMessages(this.selectedUsername);
  };

  listMessages = async (username: string) => {
    const data = {
      Username: username,
    };
    console.log(username);

    this.laodignChat = true;
    try {
      await this.hubConnection?.invoke("listMessages", data);
    } catch (error) {
      console.log(error);
    }
  };

  deleteMessage = (id: string) => {
    if (this.ProfileMessage) {
      this.ProfileMessage.messages = this.ProfileMessage.messages.filter(
        (x) => x.id !== id
      );
      const conversation = this.Conversation.find(
        (x) => x.username == this.ProfileMessage?.userName
      );
      const lengthMessage = this.ProfileMessage.messages.length - 1;
      if (conversation) {
        conversation.message = this.ProfileMessage.messages[lengthMessage].body;
        conversation.file =
          this.ProfileMessage.messages[lengthMessage].file?.name!;
        conversation.fileType =
          this.ProfileMessage.messages[lengthMessage].file?.contentType!;
        conversation.fromUsername =
          this.ProfileMessage.messages[lengthMessage].fromUsername;

        conversation.createdAt =
          this.ProfileMessage.messages[lengthMessage].createdAt;
        conversation.isRead =
          this.ProfileMessage.messages[lengthMessage].isRead;
      }
    }
  };

  get groupedMessages() {
    if (this.ProfileMessage) {
      return Object.entries(
        this.ProfileMessage.messages.reduce((Messages, message) => {
          const date = format(message.createdAt!, "dd MMM yyyy ");
          Messages[date] = Messages[date]
            ? [...Messages[date], message]
            : [message];
          return Messages;
        }, {} as { [key: string]: Messages[] })
      );
    }
  }

  connect = (id: string) => {
    // console.log(this.peer);

    const conn = this.peer?.connect(id);
    console.log(conn);
    conn?.send("dafa");

    conn?.on("open", () => {
      conn.send("dafa");
    });
    conn?.on("data", (data) => {
      console.log(data);
    });
  };

  // newPeer = () => {
  //   this.peer = new Peer(Store.userStore.user?.id!);
  //   // this.peer.on("open");
  //   console.log(this.peer);

  //   this.peer.on("connection", (conn) => {
  //     conn.on("data", (data) => {
  //       console.log(data);
  //     });
  //   });
  // };
}
