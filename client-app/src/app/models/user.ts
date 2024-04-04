export interface User {
    username: string;
    displayName: string;
    token: string;
    image?: string;
    emailVerify:boolean;
    expireVerifyCode:Date;
    email?:string
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
    photo? :string;
    emailVerify?:boolean;
    expireVerifyCode?:Date;
}