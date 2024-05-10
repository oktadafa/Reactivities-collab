export default interface ChatComment {
    id:string;
    createdAt:any;
    body:string;
    username:string;
    displayName:string;
    image:string;
    commentImage:string;
    commentParentId:string;
    showReply:boolean;
    replyComments:ChatComment[]
}