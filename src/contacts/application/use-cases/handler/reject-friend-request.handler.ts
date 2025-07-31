import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RejectFriendRequestCommand } from "../command/reject-accept-friend-request.command";
import { Inject } from "@nestjs/common";
import { IFriendRequestRepository } from "src/contacts/domain/port/friend-request.interface";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";
import { Result } from "src/shared/response/result.impl";

@CommandHandler(RejectFriendRequestCommand)
export class RejectFriendRequestHandler implements ICommandHandler<RejectFriendRequestCommand> {
    constructor(
        @Inject('IFriendRequestRepository')
        private readonly friendRequestRepository: IFriendRequestRepository,
        
        @Inject('RejectFriendRequestValidator')
        private readonly validator: IInputValidator<any>
    ) {}

    async execute(command: RejectFriendRequestCommand): Promise<Result<any>> {
        // Validar entrada
        const dto = { requestId: command.requestId };
        if (!await this.validator.isValid(dto)) {
            return Result.failed(null, this.validator.messageDto);
        }

        const { userId, requestId } = command;

        // Buscar solicitud
        const friendRequest = await this.friendRequestRepository.findById(requestId);
        if (!friendRequest) {
            return Result.error(null,'Friend request not found');
        }

        // Verificar permisos de dominio
        if (!friendRequest.canBeRespondedBy(userId)) {
            return Result.error(null, 'Cannot respond to this request');
        }

        // Rechazar solicitud (aplicará reglas de dominio)
        friendRequest.reject();

        // Persistir cambios
        const savedRequest = await this.friendRequestRepository.save(friendRequest);
        if (!savedRequest) {
            return Result.error(null, 'Failed to reject friend request');
        }
        return Result.ok(null, 'Friend request rejected successfully');
    }
}