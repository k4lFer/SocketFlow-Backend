import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RefreshTokenCommand } from "../command/refresh-token.command";
import { Result } from "src/shared/response/result.impl";
import { In } from "typeorm";
import { IJwtService } from "src/jwt/domain/interface/jwt-service.interface";
import { Inject } from "@nestjs/common";

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
    constructor(
        @Inject('IJwtService') private readonly jwtService: IJwtService
    ) {}

    async execute(command: RefreshTokenCommand): Promise<Result<any>> {
        if(!command.input) {
          return Result.error(null, 'Refresh token is required');  
        }
        const result = await this.jwtService.generateAccessTokenByRefreshToken(command.input.refreshToken);
        if(result.isSuccess) {

            return Result.ok(result.data, typeof result.messageDto);
        }
        return Result.error(null, typeof result.messageDto);
    }
    
}