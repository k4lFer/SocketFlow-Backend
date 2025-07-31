import { HttpStatus, Injectable } from "@nestjs/common";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";
import { MessageDto } from "src/shared/common/message.dto";

@Injectable()
export class AcceptFriendRequestValidator implements IInputValidator<any> {
    httpStatus: HttpStatus;
    messageDto: MessageDto | MessageDto[];

    async isValid(input: any): Promise<boolean> {
        const errors: string[] = [];
        this.httpStatus = HttpStatus.BAD_REQUEST;

        if (!input.requestId?.trim()) {
            errors.push('Request ID is required');
        }

        if (input.requestId && !this.isValidUUID(input.requestId)) {
            errors.push('Request ID must be a valid UUID');
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