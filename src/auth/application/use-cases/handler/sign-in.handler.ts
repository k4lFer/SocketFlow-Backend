import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SignInCommand } from "../command/sign-in.command";
import { Result } from "src/shared/response/result.impl";
import { AuthService } from "../../service/auth.service";

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
    constructor(
        private readonly signInService: AuthService,
    ) { }
    
    async execute(command: SignInCommand): Promise<Result<any>> {
        return await this.signInService.signIn(command.input, command.res);
    }
}