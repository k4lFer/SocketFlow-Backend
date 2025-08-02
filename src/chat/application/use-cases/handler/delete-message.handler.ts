import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteMessageCommand } from '../command/delete-message.command';
import { IMessageRepository } from '../../../domain/port/message-repository.interface';
import { IChatRepository } from '../../../domain/port/chat-repository.interface';
import { Result } from 'src/shared/response/result.impl';

@CommandHandler(DeleteMessageCommand)
export class DeleteMessageHandler implements ICommandHandler<DeleteMessageCommand> {
  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject('IChatRepository')
    private readonly chatRepository: IChatRepository
  ) {}

  async execute(command: DeleteMessageCommand): Promise<Result<any>> {
    const { messageId, userId, chatId } = command;

    // Verificar que el chat existe y el usuario es miembro
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      return Result.error(null, 'Chat not found');
    }

    if (!chat.members?.includes(userId)) {
      return Result.error(null, 'User is not a member of this chat');
    }

    // Buscar el mensaje
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      return Result.error(null, 'Message not found');
    }

    // Verificar que el mensaje pertenece al chat
    if (message.chatId !== chatId) {
      return Result.error(null, 'Message does not belong to this chat');
    }

    // Verificar que el usuario es el remitente del mensaje
    if (message.sender !== userId) {
      return Result.error(null, 'You can only delete your own messages');
    }

    // Marcar como eliminado
    message.markAsDeleted(userId);

    // Guardar el mensaje actualizado
    const updatedMessage = await this.messageRepository.save(message);
    if (!updatedMessage) {
      return Result.error(null, 'Failed to delete message');
    }

    return Result.ok(
      { messageId: updatedMessage.id, status: 'deleted' },
      'Message deleted successfully'
    );
  }
} 