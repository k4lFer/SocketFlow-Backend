import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SignUpCommand } from "../command/sign-up.command";
import { Result } from "src/shared/response/result.impl";
import { AuthService } from "../../service/auth.service";

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
    constructor(
        private readonly signUpService: AuthService
    ) { }
    async execute(command: SignUpCommand): Promise<Result<any>> {
        return await this.signUpService.signUp(command.input);
    }
}