import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";
import { RemoveFriendshipCommand } from "../command/remove-friend.command";
import { Inject } from "@nestjs/common";
import { IFriendshipRepository } from "src/contacts/domain/port/friend.interface";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";

@CommandHandler(RemoveFriendshipCommand)
export class RemoveFriendshipHandler implements ICommandHandler<RemoveFriendshipCommand> {
    constructor(
        @Inject('IFriendshipRepository')
        private readonly friendshipRepository: IFriendshipRepository,
        
        @Inject('IRemoveFriendshipValidator')
        private readonly validator: IInputValidator<any>
    ) {}

    async execute(command: RemoveFriendshipCommand): Promise<Result<any>> {
        // Validar entrada
        const dto = { friendId: command.friendId };
        if (!await this.validator.isValid(dto)) {
            return Result.failed(null, this.validator.messageDto);
        }
        const { userId, friendId } = command;
        
        if(userId == friendId) {
            return Result.error(null, "You cannot remove yourself as a friend");
        }

        // Buscar amistad
        const friendship = await this.friendshipRepository.findByUsers(userId, friendId);
        if (!friendship) {
            return Result.error(null, 'Friendship not found or already removed');
        }

        // Aplicar reglas de dominio
        friendship.remove(userId);

        // Eliminar relación bidireccional
        const savedFriendship = await this.friendshipRepository.deleteBidirectional(userId, friendId);
        if (!savedFriendship) {
            return Result.error(null, 'Failed to remove friendship');
        }

        return Result.ok(null, 'Friendship removed successfully');

    }
}