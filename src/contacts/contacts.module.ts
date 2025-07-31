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
        ContactsCommandController
    ],
    providers: [
        FriendRequestDomainService,


        // Infrastructure
        FriendRequestRepository,
        FriendshipRepository,
        FriendRequestOrmMapper,
        FriendshipOrmMapper,

        // Command Handlers
        

        // Event Handlers
        

        // Validators
        SendFriendRequestValidator,
        AcceptFriendRequestValidator,

        { provide: 'IFriendRequestRepository', useExisting: FriendRequestRepository },
        { provide: 'IFriendshipRepository', useExisting: FriendshipRepository },
        { provide: 'SendFriendRequestValidator', useExisting: SendFriendRequestValidator },
        { provide: 'AcceptFriendRequestValidator', useExisting: AcceptFriendRequestValidator }

    ],
    exports: [],
})
export class ContactsModule {}
