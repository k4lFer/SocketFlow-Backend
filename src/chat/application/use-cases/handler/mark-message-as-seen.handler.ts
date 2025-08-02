import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MarkMessageAsSeenCommand } from '../command/mark-message-as-seen.command';

import { Result } from 'src/shared/response/result.impl';
import { IMessageRepository } from 'src/chat/domain/port/message-repository.interface';
import { IChatRepository } from 'src/chat/domain/port/chat-repository.interface';

@CommandHandler(MarkMessageAsSeenCommand)
export class MarkMessageAsSeenHandler implements ICommandHandler<MarkMessageAsSeenCommand> {
  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject('IChatRepository')
    private readonly chatRepository: IChatRepository
  ) {}

  async execute(command: MarkMessageAsSeenCommand): Promise<Result<any>> {
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

    // Marcar como visto
    message.markAsSeen(userId);

    // Guardar el mensaje actualizado
    const updatedMessage = await this.messageRepository.save(message);
    if (!updatedMessage) {
      return Result.error(null, 'Failed to update message status');
    }

    return Result.ok(
      { messageId: updatedMessage.id, status: 'seen' },
      'Message marked as seen'
    );
  }
} 