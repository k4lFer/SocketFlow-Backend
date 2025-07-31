import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "src/shared/common/guards/access-token.guard";
import { SendRequestDto } from "../application/dto/in/send-request.dto";
import { UserPayload } from "src/shared/common/interface/user-payload.interface";
import { UserActive } from "src/shared/common/decorators/user-active.decorator";
import { Response } from "express";
import { SendFriendRequestCommand } from "../application/use-cases/command/send-friend-request.command";
import { ResponseHelper } from "src/shared/response/response.helper";

@Controller('contacts')
@ApiTags('contacts')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class ContactsCommandController {
    constructor(
        private readonly command: CommandBus
    ) {}

    @Post('send-friend-request')
    @ApiBody({ type: SendRequestDto })
    async sendFriendRequest(
        @UserActive() user: UserPayload,
        @Body() input: SendRequestDto,
        @Res() res: Response
    ) : Promise<any> {
        const data = { senderId: user.userId, receiverId: input.receiverId };
        const result = await this.command.execute(new SendFriendRequestCommand(data));
        return ResponseHelper.send(res, result);
    }

    @Post('accept-friend-request')
    @ApiBody({ type: SendRequestDto })
    async acceptFriendRequest(
        @UserActive() user: UserPayload,
        @Body() input: SendRequestDto,
        @Res() res: Response
    ) : Promise<any> {
        //const result = await this.command.execute(new AcceptFriendRequestCommand(user.userId, input));
        //return ResponseHelper.send(res, result);
    }

    @Post('reject-friend-request')
    @ApiBody({ type: SendRequestDto })
    async rejectFriendRequest(
        @UserActive() user: UserPayload,
        @Body() input: SendRequestDto,
        @Res() res: Response
    ) : Promise<any> {
        //const result = await this.command.execute(new RejectFriendRequestCommand(user.userId, input));
        //return ResponseHelper.send(res, result);
    }

    @Post('remove-friend')
    @ApiBody({ type: SendRequestDto })
    async removeFriend(
        @UserActive() user: UserPayload,
        @Body() input: SendRequestDto,
        @Res() res: Response
    ) : Promise<any> {
        //const result = await this.command.execute(new RemoveFriendCommand(user.userId, input));
        //return ResponseHelper.send(res, result);
    }

}
