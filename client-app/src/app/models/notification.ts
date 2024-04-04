export interface INotification {
    toId :number,
    date:string,
    message:string,
    from:string,
    image:string,
    to:string,
    id: string,
    userNameFrom :string
}

export class Notifikasi implements INotification {
    constructor(notifikasi:INotification)
    {
        this.toId = notifikasi.toId,
this.date = notifikasi.date,
this.message = notifikasi.message,
this.from = notifikasi.from,
this.image = notifikasi.image,
this.to = notifikasi.to
this.id = notifikasi.id
this.userNameFrom = notifikasi.userNameFrom
    }
    toId: number;
    date: string;
    message: string;
    from: string;
    image: string;
    to: string;
    id: string;
    userNameFrom:string;
}