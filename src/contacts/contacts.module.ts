import { Module } from '@nestjs/common';
import { FriendRequestRepository } from './infrastructure/adapter/friend-request.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestOrmEntity } from './infrastructure/orm/friend-request.orm-entity';
import { FriendOrmEntity } from './infrastructure/orm/friend.orm-entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { FriendshipRepository } from './infrastructure/adapter/friend.repository';
import { FriendRequestOrmMapper } from './infrastructure/mapper/friend-request.orm.mapper';
import { FriendshipOrmMapper } from './infrastructure/mapper/friend.orm.mapper';
import { ContactsCommandController } from './presentation/contacts.command.controller';
import { SendFriendRequestValidator } from './application/validators/send-friend-request.validator';
import { AcceptFriendRequestValidator } from './application/validators/accept-friend-request.validator';
import { FriendRequestDomainService } from './domain/service/friend-request.domain.service';
import { ContactsQueryController } from './presentation/contacts.query.controller';
import { SentFriendRequestHandler } from './application/use-cases/handler/sent-friend-request.handler';
import { AcceptFriendRequestHandler } from './application/use-cases/handler/accept-friend-request.handler';
import { RejectFriendRequestHandler } from './application/use-cases/handler/reject-friend-request.handler';
import { RemoveFriendshipHandler } from './application/use-cases/handler/remove-friend.request.handler';
import { GetFriendsHandler } from './application/use-cases/handler/get-friends.handler';
import { GetContactsStatsHandler } from './application/use-cases/handler/get-contacts-stats.handler';
import { GetReceivedFriendRequestsHandler } from './application/use-cases/handler/get-received-friend-requests.handler';
import { GetSentFriendRequestsHandler } from './application/use-cases/handler/get-sent-friend-requests.handler';
import { SearchUsersHandler } from './application/use-cases/handler/search-users.handler';
import { FriendRequestAcceptedEventHandler } from './application/event-handler/friend-request-accepted.event-handler';
import { FriendRequestSentEventHandler } from './application/event-handler/friend-request-sent.event-handler';
import { RejectFriendRequestValidator } from './application/validators/reject-friend-request.validator';
import { RemoveFriendshipValidator } from './application/validators/remove-friendship.validator';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FriendRequestOrmEntity,
            FriendOrmEntity
        ]),
        JwtModule,
        UserModule
    ],
    controllers: [
        ContactsCommandController,
        ContactsQueryController
    ],
    providers: [
        FriendRequestDomainService,


        // Infrastructure
        FriendRequestRepository,
        FriendshipRepository,
        FriendRequestOrmMapper,
        FriendshipOrmMapper,

        // Command Handlers
        SentFriendRequestHandler,
        AcceptFriendRequestHandler,
        RejectFriendRequestHandler,
        RemoveFriendshipHandler,

        // Query Handlers
        GetFriendsHandler,
        GetContactsStatsHandler,
        GetReceivedFriendRequestsHandler,
        GetSentFriendRequestsHandler,
        SearchUsersHandler,
        

        // Event Handlers
        FriendRequestAcceptedEventHandler,
        FriendRequestSentEventHandler,

        // Validators
        SendFriendRequestValidator,
        AcceptFriendRequestValidator,
        RejectFriendRequestValidator,
        RemoveFriendshipValidator,

        { provide: 'IFriendRequestRepository', useExisting: FriendRequestRepository },
        { provide: 'IFriendshipRepository', useExisting: FriendshipRepository },
        { provide: 'SendFriendRequestValidator', useExisting: SendFriendRequestValidator },
        { provide: 'AcceptFriendRequestValidator', useExisting: AcceptFriendRequestValidator }

    ],
    exports: [],
})
export class ContactsModule {}
