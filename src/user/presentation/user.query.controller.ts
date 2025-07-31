import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { UserActive } from "src/shared/common/decorators/user-active.decorator";
import { AccessTokenGuard } from "src/shared/common/guards/access-token.guard";
import { UserPayload } from "src/shared/common/interface/user-payload.interface";
import { MyProfileQuery } from "../application/use-cases/query/my-profile.query";
import { Response } from "express";
import { UserProfileQuery } from "../application/use-cases/query/user-profile.query";
import { ResponseHelper } from "src/shared/response/response.helper";

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class UserQueryController {
    constructor(
        private readonly query: QueryBus
    ) {}

    @Get('my-profile')
    async getMyProfile(
        @UserActive() user: UserPayload,
        @Res() res: Response
    ) : Promise<any> {
        const result = await this.query.execute(new MyProfileQuery(user.userId));
        return ResponseHelper.send(res, result);
    }

    @Get('profile/:id')
    @ApiBody({ type: String })
    async getProfile(
        @Param('id') id: string,
        @Res() res: Response
    ) : Promise<any> {
        const result = await this.query.execute(new UserProfileQuery(id));
        return ResponseHelper.send(res, result);
    }

}
