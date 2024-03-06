export interface ServerError {
    statusCode: number;
    message: string;
    errors: any;
    title: string;
    details: string;
}