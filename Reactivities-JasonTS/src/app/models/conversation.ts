interface Conversation {
  displayName: string;
  username: string;
  image: string;
  message: string;
  createdAt: string;
  file: string | null;
  fileType: string | null;
  isRead: boolean;
  fromUsername: string;
  noReadCount: number;
}

interface Participant {
  displayName: string;
  username: string;
  image: string;
}
interface Messages {
  id: string | null;
  body: string;
  fromUsername: string;
  createdAt: string;
  image: string | null;
  fromDisplayName: string | null;
  isRead: boolean;
  file: FileBase64 | null;
  showOptions: boolean;
}

interface ProfileMessage {
  id: string;
  userName: string;
  displayName: string;
  image: string;
  messages: Messages[];
}

interface FileBase64 {
  name: string;
  size: number;
  contentType: string;
  base64: string;
  message: string;
}

interface UserCall {
  DisplayName: string;
  image: string;
  status: string;
}

interface ListMessage {
  messageDelete: Messages;
  latestMessage: Messages;
}
