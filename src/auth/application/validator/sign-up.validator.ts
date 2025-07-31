import { HttpStatus, Injectable } from "@nestjs/common";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";
import { SignUpDto } from "../dto/in/sign-up.dto";
import { MessageDto } from "src/shared/common/message.dto";

@Injectable()
export class SignUpValidator implements IInputValidator<SignUpDto> {
  httpStatus: HttpStatus;
  messageDto: MessageDto | MessageDto[];

  async isValid(input: SignUpDto): Promise<boolean> {
    const errors: string[] = [];
    this.httpStatus = HttpStatus.BAD_REQUEST;

    if (!input.username?.trim()) errors.push('Username is required');
    if (!input.email?.trim()) errors.push('Email is required');
    if (!input.password?.trim()) errors.push('Password is required');

    if (errors.length > 0) {
      this.messageDto = new MessageDto('validation-error', errors);
      return false;
    }

    return true;
  }
}
