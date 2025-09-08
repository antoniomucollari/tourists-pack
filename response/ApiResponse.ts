import LoginResponse from "@/response/LoginResponse";

export default interface ApiResponse<T>{
    statusCode: number;
    message: string;
    data: T;
}


