import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AcceptFriendRequestCommand } from "../command/accept-friend-request.command";
import { Inject } from "@nestjs/common";
import { IFriendRequestRepository } from "src/contacts/domain/port/friend-request.interface";
import { IFriendshipRepository } from "src/contacts/domain/port/friend.interface";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";
import { FriendRequestDomainService } from "src/contacts/domain/service/friend-request.domain.service";
import { Result } from "src/shared/response/result.impl";

@CommandHandler(AcceptFriendRequestCommand)
export class AcceptFriendRequestHandler implements ICommandHandler<AcceptFriendRequestCommand> {
    constructor(
        @Inject('IFriendRequestRepository')
        private readonly friendRequestRepository: IFriendRequestRepository,
        
        @Inject('IFriendshipRepository')
        private readonly friendshipRepository: IFriendshipRepository,
        
        @Inject('IAcceptFriendRequestValidator')
        private readonly validator: IInputValidator<any>,
        
        private readonly friendRequestDomainService: FriendRequestDomainService
    ) {}

    async execute(command: AcceptFriendRequestCommand): Promise<Result<any>> {
        // Validar entrada
        const dto = { requestId: command.requestId };
        if (!await this.validator.isValid(dto)) {
            return Result.failed(null, this.validator.messageDto);
        }
        const { userId, requestId } = command;

        // Buscar solicitud
        const friendRequest = await this.friendRequestRepository.findById(requestId);
        if (!friendRequest) {
            return Result.error(null, 'Friend request not found');
        }

        // Verificar permisos de dominio
        if (!friendRequest.canBeRespondedBy(userId)) {
            return Result.error(null, 'Cannot respond to this request');
        }

        // Aceptar solicitud (aplicará reglas de dominio)
        friendRequest.accept();

        // Crear amistad bidireccional
        const friendships = this.friendRequestDomainService.createBidirectionalFriendship(
            friendRequest.senderId,
            friendRequest.receiverId
        );

        // Persistir cambios
        await this.friendRequestRepository.save(friendRequest);
        for (const friendship of friendships) {
            const result = await this.friendshipRepository.save(friendship);
        }

        // Confirmar eventos
        friendRequest.commit();
        friendships.forEach(f => f.commit());

        return Result.ok(null, 'Friend request accepted successfully');

    }
}