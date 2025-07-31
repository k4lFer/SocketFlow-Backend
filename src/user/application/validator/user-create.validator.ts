import { HttpStatus, Injectable } from "@nestjs/common";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";
import { UserCreateInput } from "../dto/in/user.create";
import { MessageDto } from "src/shared/common/message.dto";

@Injectable()
export class UserCreateValidator implements IInputValidator<UserCreateInput> {
    httpStatus: HttpStatus;
    messageDto: MessageDto | MessageDto[];

    constructor() {}

    async isValid(input: UserCreateInput): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}