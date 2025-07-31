import { Command } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";
import { RefreshTokenDto } from "../../dto/out/refresh-token.input.dto";

export class RefreshTokenCommand extends Command<Result<any>> {
    constructor (
        public readonly input: RefreshTokenDto
    ){
        super();
    }
}