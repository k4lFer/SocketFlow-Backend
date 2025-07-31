import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";
import { SendRequestDto } from "../dto/in/send-request.dto";
import { MessageDto } from "src/shared/common/message.dto";
import { IFriendRequestRepository } from "src/contacts/domain/port/friend-request.interface";

@Injectable()
export class SendFriendRequestValidator implements IInputValidator<SendRequestDto>{
    httpStatus: HttpStatus;
    messageDto: MessageDto | MessageDto[];

    async isValid(input: SendRequestDto): Promise<boolean> {
        const errors: string[] = [];
        this.httpStatus = HttpStatus.BAD_REQUEST;

        if (!input.receiverId?.trim()) {
            errors.push('Receiver ID is required');
        }

        if (input.receiverId && !this.isValidUUID(input.receiverId)) {
            errors.push('Receiver ID must be a valid UUID');
        }

        if (errors.length > 0) {
            this.messageDto = new MessageDto('validation-error', errors);
            return false;
        }

        return true;
    }

    private isValidUUID(uuid: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

}