import { HttpStatus, Injectable } from "@nestjs/common";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";
import { RemoveFriendDto } from "../dto/in/remove-friend.dto";
import { MessageDto } from "src/shared/common/message.dto";

@Injectable()
export class RemoveFriendshipValidator implements IInputValidator<RemoveFriendDto> {
    httpStatus: HttpStatus;
    messageDto: MessageDto | MessageDto[];

    async isValid(input: RemoveFriendDto): Promise<boolean> {
        const errors: string[] = [];
        this.httpStatus = HttpStatus.BAD_REQUEST;

        if (!input.friendId?.trim()) {
            errors.push('Friend ID is required');
        }

        if (input.friendId && !this.isValidUUID(input.friendId)) {
            errors.push('Friend ID must be a valid UUID');
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