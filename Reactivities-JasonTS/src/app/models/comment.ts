export default interface ChatComment {
    id:string;
    createdAt:any;
    body:string;
    username:string;
    displayName:string;
    image:string;
    commentImage:string;
    replyComments:ChatComment[]
}