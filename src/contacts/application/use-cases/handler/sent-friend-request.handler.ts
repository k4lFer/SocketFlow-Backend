import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { SendFriendRequestCommand } from "../command/send-friend-request.command";
import { Result } from "src/shared/response/result.impl";
import { IFriendshipRepository } from "src/contacts/domain/port/friend.interface";
import { Inject } from "@nestjs/common";
import { IFriendRequestRepository } from "src/contacts/domain/port/friend-request.interface";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";
import { SendRequestDto } from "../../dto/in/send-request.dto";
import { FriendRequest } from "src/contacts/domain/entity/friend-request.model";
import { FriendRequestSentEvent } from "src/contacts/domain/events/friend-request-sent.event";
import { FriendRequestDomainService } from "src/contacts/domain/service/friend-request.domain.service";

@CommandHandler(SendFriendRequestCommand)
export class SentFriendRequestHandler implements ICommandHandler<SendFriendRequestCommand> {
    constructor(
        @Inject('IFriendRequestRepository')
        private readonly friendRequestRepository: IFriendRequestRepository,
        @Inject('IFriendRepository')
        private readonly friendshipRepository: IFriendshipRepository,
        @Inject('ISendFriendRequestValidator')
        private readonly validator: IInputValidator<SendRequestDto>,
        private readonly friendRequestDomainService: FriendRequestDomainService,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: SendFriendRequestCommand): Promise<Result<any>> {
        if(!(await this.validator.isValid(command.data)))
        {
            return Result.failed(null, this.validator.messageDto);
        }

            const { senderId, receiverId } = command.data;

            // Aplicar reglas de dominio
            const validation = await this.friendRequestDomainService.canSendFriendRequest(
                senderId,
                receiverId,
                this.friendRequestRepository,
                this.friendshipRepository
            );

            if (!validation.isSuccess) {
                return Result.failed(null, validation.messageDto);
            }

            // Crear entidad de dominio
            const friendRequest = FriendRequest.create(senderId, receiverId);

            // Persistir
            const savedRequest = await this.friendRequestRepository.save(friendRequest);
            if (!savedRequest) {
                return Result.error(null, 'Failed to send friend request');
            }
            // Confirmar eventos de dominio
            friendRequest.commit();

            return Result.ok(
                { requestId: savedRequest.id },
                'Friend request sent successfully'
            );
    }

}
