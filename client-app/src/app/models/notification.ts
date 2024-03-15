export interface INotification {
    id :number,
    date:string,
    message:string,
    from:string,
    image:string,
    to:string,
}

export class Notifikasi implements INotification {
    constructor(notifikasi:INotification)
    {
        this.id=  notifikasi.id,
this.date = notifikasi.date,
this.message = notifikasi.message,
this.from = notifikasi.from,
this.image = notifikasi.image,
this.to = notifikasi.to
    }
    id: number;
    date: string;
    message: string;
    from: string;
    image: string;
    to: string;
}