export default interface ApiResponse<T>{
    statusCode: number;
    message: string;
    data: T;
}


