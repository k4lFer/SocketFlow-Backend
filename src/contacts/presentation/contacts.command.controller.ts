import { Body, Controller, Delete, Param, Post, Res, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "src/shared/common/guards/access-token.guard";
import { SendRequestDto } from "../application/dto/in/send-request.dto";
import { UserPayload } from "src/shared/common/interface/user-payload.interface";
import { UserActive } from "src/shared/common/decorators/user-active.decorator";
import { Response } from "express";
import { SendFriendRequestCommand } from "../application/use-cases/command/send-friend-request.command";
import { ResponseHelper } from "src/shared/response/response.helper";
import { AcceptFriendRequestCommand } from "../application/use-cases/command/accept-friend-request.command";
import { RejectFriendRequestCommand } from "../application/use-cases/command/reject-accept-friend-request.command";
import { RemoveFriendshipCommand } from "../application/use-cases/command/remove-friend.command";
import { AcceptFriendRequestDto } from "../application/dto/in/aceept-friend-request.dto";
import { RemoveFriendDto } from "../application/dto/in/remove-friend.dto";
import { RejectFriendRequestDto } from "../application/dto/in/reject-friend-request.dto";
import { request } from "http";

@Controller('contacts')
@ApiTags('contacts-command')
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
    @ApiBody({ type: AcceptFriendRequestDto })
    async acceptFriendRequest(
        @UserActive() user: UserPayload,
        @Body() input: AcceptFriendRequestDto,
        @Res() res: Response
    ) : Promise<any> {
        const result = await this.command.execute(new AcceptFriendRequestCommand(user.userId, input.requestId));
        return ResponseHelper.send(res, result);
    }

    @Post('reject-friend-request')
    @ApiBody({ type: RejectFriendRequestDto })
    async rejectFriendRequest(
        @UserActive() user: UserPayload,
        @Body() input: RejectFriendRequestDto,
        @Res() res: Response
    ) : Promise<any> {
        const result = await this.command.execute(new RejectFriendRequestCommand(user.userId, input.requestId));
        return ResponseHelper.send(res, result);
    }

    @Delete('remove-friend')
    @ApiBody({ type: RemoveFriendDto })
    async removeFriend(
        @UserActive() user: UserPayload,
        @Body() input: RemoveFriendDto,
        @Res() res: Response
    ) : Promise<any> {
        const result = await this.command.execute(new RemoveFriendshipCommand(user.userId, input.friendId));
        return ResponseHelper.send(res, result);
    }

    @Post("cancel-friend-request/:requestId")
    async deleteFriend(
        @Param("requestId") requestId: string, 
        @UserActive() user: UserPayload,
        @Res() res: Response
    ) : Promise<any> {

    }

}
