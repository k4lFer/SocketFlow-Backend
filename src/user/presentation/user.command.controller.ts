import { Body, Controller, Patch, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AccessTokenGuard } from "src/shared/common/guards/access-token.guard";
import { UserPatchInput } from "../application/dto/in/user.patch";
import { UserActive } from "src/shared/common/decorators/user-active.decorator";
import { UserPayload } from "src/shared/common/interface/user-payload.interface";
import { CommandBus } from "@nestjs/cqrs";
import { UserPatchCommand } from "../application/use-cases/command/user-patch.command";
import { ResponseHelper } from "src/shared/response/response.helper";

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class UserCommandController {
    constructor(private readonly command: CommandBus) {}

    @Patch('patch')
    @ApiBody({ type: UserPatchInput })
    async patch(
        @Body() input: UserPatchInput,
        @UserActive() user: UserPayload,
        @Res() res: Response
    ) : Promise<any> {
        const result = await this.command.execute(new UserPatchCommand(user.userId, input));
        return ResponseHelper.send(res, result);
    }

    @Patch('change-password')
    async changePassword(
        @Body() input: any,
        @UserActive() user: UserPayload,
        @Res() res: Response
    ) : Promise<any> {
        //const result = await this.command.execute(new UserChangePasswordCommand(user.userId, input.password));
       // return ResponseHelper.send(res, result);
    }
}