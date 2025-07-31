import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { UserActive } from "src/shared/common/decorators/user-active.decorator";
import { AccessTokenGuard } from "src/shared/common/guards/access-token.guard";
import { UserPayload } from "src/shared/common/interface/user-payload.interface";
import { GetFriendsQuery } from "../application/use-cases/query/get-friends.query";
import { ResponseHelper } from "src/shared/response/response.helper";
import { GetReceivedFriendRequestsQuery } from "../application/use-cases/query/get-received-friend-requests.query";
import { GetSentFriendRequestsQuery } from "../application/use-cases/query/get-sent-friend-requests.query";
import { SearchUsersQuery } from "../application/use-cases/query/search-users.query";
import { GetContactsStatsQuery } from "../application/use-cases/query/get-contacts-stats.query";

@Controller('contacts')
@ApiTags('contacts')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class ContactsQueryController {
    constructor(
        private readonly queryBus: QueryBus
    ) {}

    /*
    Queries principales:

    GetFriendsQuery - Lista de amigos paginada
    GetReceivedFriendRequestsQuery - Solicitudes recibidas paginadas
    GetSentFriendRequestsQuery - Solicitudes enviadas paginadas
    SearchUsersQuery - Buscar usuarios paginado (searchTerm puede ser null)
    GetContactsStatsQuery - Estadísticas sin paginación
    
    */

    @Get('friends')
    @ApiOperation({ summary: 'Obtener lista de amigos paginada' })
    @ApiQuery({ name: 'pageNumber', required: false, type: Number, description: 'Número de página' })
    @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Tamaño de página' })
    async getFriends(
        @UserActive() user: UserPayload,
        @Query('pageNumber') pageNumber: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Res() res: Response
    ): Promise<any> {
        const query = new GetFriendsQuery(user.userId, Number(pageNumber), Number(pageSize));
        const result = await this.queryBus.execute(query);
        return ResponseHelper.send(res, result);
    }

    @Get('friend-requests/received')
    @ApiOperation({ summary: 'Obtener solicitudes de amistad recibidas paginadas' })
    @ApiQuery({ name: 'pageNumber', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    async getReceivedFriendRequests(
        @UserActive() user: UserPayload,
        @Query('pageNumber') pageNumber: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Res() res: Response
    ): Promise<any> {
        const query = new GetReceivedFriendRequestsQuery(user.userId, Number(pageNumber), Number(pageSize));
        const result = await this.queryBus.execute(query);
        return ResponseHelper.send(res, result);
    }

    @Get('friend-requests/sent')
    @ApiOperation({ summary: 'Obtener solicitudes de amistad enviadas paginadas' })
    @ApiQuery({ name: 'pageNumber', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    async getSentFriendRequests(
        @UserActive() user: UserPayload,
        @Query('pageNumber') pageNumber: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Res() res: Response
    ): Promise<any> {
        const query = new GetSentFriendRequestsQuery(user.userId, Number(pageNumber), Number(pageSize));
        const result = await this.queryBus.execute(query);
        return ResponseHelper.send(res, result);
    }

    @Get('search')
    @ApiOperation({ summary: 'Buscar usuarios por username con paginación' })
    @ApiQuery({ name: 'searchTerm', required: false, description: 'Username a buscar (opcional)' })
    @ApiQuery({ name: 'pageNumber', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    async searchUsers(
        @UserActive() user: UserPayload,
        @Query('searchTerm') searchTerm: string | null = null,
        @Query('pageNumber') pageNumber: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Res() res: Response
    ): Promise<any> {
        const query = new SearchUsersQuery(user.userId, searchTerm, Number(pageNumber), Number(pageSize));
        const result = await this.queryBus.execute(query);
        return ResponseHelper.send(res, result);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Obtener estadísticas de contactos' })
    async getContactsStats(
        @UserActive() user: UserPayload,
        @Res() res: Response
    ): Promise<any> {
        const query = new GetContactsStatsQuery(user.userId);
        const result = await this.queryBus.execute(query);
        return ResponseHelper.send(res, result);
    }
}