export interface User {
  id: string;
  email: string;
  displayName: string;
  userName: string;
  image?: string;
}

export interface UserFormValues {
  email: string;
  password: string;
  displayName?: string;
  username?: string;
  photo?: string;
}
