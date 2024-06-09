import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { Store } from "./store";
import { format } from "date-fns";
import Peer from "peerjs";
import Swal from "sweetalert2";
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
  newMessage: Messages[] = [];
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
      .withUrl(import.meta.env.VITE_CHAT_URL, {
        accessTokenFactory: () =>
          Store.commonStore.bearer?.accessToken as string,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection.start().finally(() => (this.loadingConversation = true));

    this.hubConnection.on("LoadConversation", (data: Conversation[]) => {
      runInAction(() => {
        this.CountNewMessage = 0;
        this.Conversation = data;
        this.Conversation.forEach((e) => {
          this.CountNewMessage += e.noReadCount;
        });
        this.Conversation.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loadingConversation = false;
      });
    });

    this.hubConnection.on("ReceiveMessage", (data: Messages) => {
      runInAction(() => {
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
        }

        if (this.ProfileMessage?.userName == data.fromUsername) {
          const check = this.ProfileMessage?.messages.some(
            (x) => x.id == data.id
          );
          if (!check) {
            this.ProfileMessage?.messages.push(data);
          }
        }

        this.Conversation.forEach((e) => {
          if (e.username == data.fromUsername) {
            e.fromUsername = data.fromUsername;
            e.message = data.body;
            e.createdAt = data.createdAt;
            e.isRead = false;
            e.file = data.file?.name!;
            e.fileType = data.file?.contentType!;
            if (this.ProfileMessage?.userName != e.username) {
              e.noReadCount += 0.5;
              this.CountNewMessage += 0.5;
              const checkMessage = this.newMessage.some((x) => x.id == data.id);
              if (!checkMessage) {
                this.newMessage.push(data);
              }
            }
          }

          if (
            this.ProfileMessage?.userName == data.fromUsername &&
            e.fromUsername == this.ProfileMessage.userName
          ) {
            e.isRead = true;
            data.image = null;

            this.hubConnection?.invoke("ReadMessage", data);
          }
        });

        this.Conversation.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    });

    this.hubConnection.on("ListMessage", (list: ProfileMessage) => {
      runInAction(() => {
        console.log(list);

        this.ProfileMessage = list;
        this.newMessage = this.newMessage.filter(
          (x) => x.fromUsername !== list.userName
        );
        this.Conversation.forEach((e) => {
          console.log(e.fromUsername, e.isRead, e.noReadCount);

          if (e.fromUsername == list.userName) {
            this.CountNewMessage -= e.noReadCount * 2;
            e.noReadCount = 0;
            e.isRead = true;
          }
        });
        this.laodignChat = false;
      });
    });

    this.hubConnection.on("ReadMessage", (conversation: Conversation) => {
      runInAction(() => {
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

        //Jika Pesan dikirim dan user sedang yang dituju sedang membuka daftar pesan dengan user pengirim pesan
        if (this.ProfileMessage?.userName == conversation.username) {
          this.ProfileMessage.messages.forEach((e) => {
            if (e.fromUsername == conversation.username) {
              e.isRead = true;
            }
          });
          // console.

          // Function Ketika User Yang dikirim pesan, diberitahu bahwa pesan telah di baca
          this.Conversation.forEach((e) => {
            if (e.username == conversation.fromUsername) {
              e.isRead = true;
              e.noReadCount = 0;
            }
          });
        }
      });
    });

    this.hubConnection.on("DeleteMessage", (messages: ListMessage) => {
      if (
        this.ProfileMessage?.userName == messages.messageDelete.fromUsername
      ) {
        this.ProfileMessage.messages = this.ProfileMessage.messages.filter(
          (x) => x.id !== messages.messageDelete.id
        );
      }
      this.Conversation.forEach((x) => {
        if (x.username == messages.messageDelete.fromUsername) {
          x.file = messages.latestMessage.file?.name!;
          x.fileType = messages.latestMessage.file?.contentType!;
          x.fromUsername = messages.latestMessage.fromUsername;
          x.isRead = messages.latestMessage.isRead;
          x.createdAt = messages.latestMessage.createdAt;
          x.message = messages.latestMessage.body;
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

    this.laodignChat = true;
    try {
      await this.hubConnection?.invoke("listMessages", data);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "sorry there's a problem",
        icon: "error",
      });
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

  stopHubConnection = () => {
    this.hubConnection
      ?.stop()
      .catch((error) => console.log("Error stopping the connection: ", error));
  };
}
