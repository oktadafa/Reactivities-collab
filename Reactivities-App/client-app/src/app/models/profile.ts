import { User } from "./user";

export interface IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    followersCount: number;
    followingCount: number;
    following: boolean;
    photo?: Photo[];
}

export class Profile implements IProfile {
    // static image: string;
    constructor(user : User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }

    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    followersCount = 0;
    followingCount = 0;
    following = false;
    photos?: Photo[];

}

export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}

export interface userActivity {
    id: string;
    title: string;
    category: string;
    date: Date;
}