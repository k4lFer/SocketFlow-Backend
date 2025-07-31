import { HttpStatus } from "@nestjs/common";
import { IOutput } from "../common/interface/output.interface";
import { MessageDto } from "../common/message.dto";

export class Result<T> implements IOutput<T> {
    data: T | null;
    isSuccess: boolean;
    httpStatus: HttpStatus;
    messageDto: MessageDto | MessageDto[];

    constructor(
        data: T | null,
        isSuccess: boolean,
        httpStatus: HttpStatus,
        messageDto: MessageDto | MessageDto[]
    ) {
        this.data = data;
        this.isSuccess = isSuccess;
        this.httpStatus = httpStatus;
        this.messageDto = messageDto;
    }

    static ok<T>(data: T | null, message: string | "Operation successful"): Result<T> {
        const messageDto = new MessageDto("Success", message);
        return new Result<T>(data, true, HttpStatus.OK, messageDto);
    }

    static created<T>(data: T | null, message: string | "Created successfully"): Result<T> {
        const messageDto = new MessageDto("Created", message);
        return new Result<T>(data, true, HttpStatus.CREATED, messageDto);
    }

    static error<T>(data: T | null, message: string): Result<T> {
        const messageDto = new MessageDto("Error", message);
        return new Result<T>(data, false, HttpStatus.INTERNAL_SERVER_ERROR, messageDto);
    }
    
    static exception<T>(data: T | null, message: string, p0: string): Result<T> {
        const messageDto = new MessageDto("Exception", message||p0);
        return new Result<T>(data, false, HttpStatus.INTERNAL_SERVER_ERROR, messageDto);
    }

    static failed<T>(data: T | null, message: MessageDto | MessageDto[]): Result<T> {
        return new Result<T>(data, false, HttpStatus.BAD_REQUEST, message);
    }

}
