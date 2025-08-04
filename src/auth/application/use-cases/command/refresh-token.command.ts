import { Command } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";

export class RefreshTokenCommand extends Command<Result<any>> {
    constructor (
        public readonly input: string,
    ){
        super();
    }
}