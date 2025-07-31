import { IHttpResponse } from "./http.response.interface";
import { IMessageDto } from "./message.dto.interface";

export interface IInputValidator<T> extends IHttpResponse, IMessageDto {
    isValid(input: T): Promise<boolean>;
}