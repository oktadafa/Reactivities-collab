export default interface ChatComment {
    id: number,
    CreatedAt: Date,
    body: string;
    username: string;
    displayName: string;
    image: string;
}