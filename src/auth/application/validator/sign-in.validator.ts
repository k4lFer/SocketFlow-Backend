import { HttpStatus, Injectable } from "@nestjs/common";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";
import { SignInDto } from "../dto/in/sign-in.dto";
import { MessageDto } from "src/shared/common/message.dto";

@Injectable()
export class SignInValidator implements IInputValidator<SignInDto> {
    httpStatus: HttpStatus;
    messageDto: MessageDto | MessageDto[];
    
    async isValid(input: SignInDto): Promise<boolean> {
        try {
            const errors : string[] = [];
            this.httpStatus = HttpStatus.BAD_REQUEST;

            if(!input.email.trim()) errors.push('Email is required');
            if(!input.password.trim()) errors.push('Password is required');

            if(errors.length > 0) {
                this.messageDto = new MessageDto('validation-error', errors);
                return false;
            }
            return true;
        }
        catch(e){
            this.messageDto = new MessageDto('error', ['Validation error: ' + e.message]);
            this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            return false;
        }    
    }
    
}