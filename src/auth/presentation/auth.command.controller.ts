import { Body, Controller, Ip, Post, Req, Res, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { SignInDto } from "../application/dto/in/sign-in.dto";
import { Response } from "express";
import { SignInCommand } from "../application/use-cases/command/sign-in.command";
import { ResponseHelper } from "src/shared/response/response.helper";
import { SignUpDto } from "../application/dto/in/sign-up.dto";
import { SignUpCommand } from "../application/use-cases/command/sign-up.command";
import { RefreshTokenDto } from "../application/dto/out/refresh-token.input.dto";
import { RefreshTokenCommand } from "../application/use-cases/command/refresh-token.command";
import { AccessTokenGuard } from "src/shared/common/guards/access-token.guard";
import { UserActive } from "src/shared/common/decorators/user-active.decorator";
import { UserPayload } from "src/shared/common/interface/user-payload.interface";
import { SignOutCommand } from "../application/use-cases/command/sign-out.command";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor (
        private readonly command: CommandBus
    ) {}

    @Post('sign-in')
    @ApiBody({ type: SignInDto })
    async signIn(
        @Body() input: SignInDto,
        @Res() res: Response,
    ) : Promise<any> {
        const result = await this.command.execute(new SignInCommand(input));
        return ResponseHelper.send(res, result);
    }
    
    @Post('sign-up')
    @ApiBody({ type: SignUpDto })
    async signUp(
        @Body() input: SignUpDto,
        @Res() res: Response,
    ) : Promise<any> {
        const result = await this.command.execute(new SignUpCommand(input));
        return ResponseHelper.send(res, result);
    }

    
    @Post('refresh-token')
    @ApiBody({ type: RefreshTokenDto })
    async refreshToken(
        @Body() input: RefreshTokenDto,
        @Res() res: Response
    ) : Promise<any> {
        const result = await this.command.execute(new RefreshTokenCommand(input));
        return ResponseHelper.send(res, result);
    }

    @Post('sign-out')
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    async signOut(
        @UserActive() user: UserPayload,
        @Req() req: Request,    
        @Res() res: Response        
    ): Promise<any> {
        const socketId = req.headers['x-socket-id'] as string;
        const result = await this.command.execute(new SignOutCommand(user.userId, socketId));
        return ResponseHelper.send(res, result);
    }
    
}