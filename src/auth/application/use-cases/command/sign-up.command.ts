import { Command } from "@nestjs/cqrs";
import { SignUpDto } from "../../dto/in/sign-up.dto";
import { Result } from "src/shared/response/result.impl";

export class SignUpCommand extends Command<Result<any>> {
    constructor(
        public readonly input: SignUpDto
    ) { 
        super();
    }
}