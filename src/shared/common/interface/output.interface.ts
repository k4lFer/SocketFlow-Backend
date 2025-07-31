import { IHttpResponse } from "./http.response.interface";
import { IMessageDto } from "./message.dto.interface";

export interface IOutput<T> extends IHttpResponse, IMessageDto
{
    data:T | null;
    isSuccess: boolean;
}