import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SendMessageCommand } from '../command/send-message.command';
import { Result } from 'src/shared/response/result.impl';
import { v4 as uuidv4 } from 'uuid';
import { IMessageRepository } from 'src/chat/domain/port/message-repository.interface';
import { IChatRepository } from 'src/chat/domain/port/chat-repository.interface';
import { AudioMessage, FileAttachment, Message } from 'src/chat/domain/entity/message.model';
import { FileUploadService } from '../../service/file-upload.service';
import { SendMessageDto } from '../../dto/out/send-message.dto';
import { map } from 'rxjs';
import { MessageMapper } from '../../mapper/message.mapper';
import { ChatGateway } from 'src/chat/infrastructure/gateway/chat.gateway';

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject('IChatRepository')
    private readonly chatRepository: IChatRepository,
    @Inject(FileUploadService)
    private readonly fileUploadService: FileUploadService,
    private readonly messageMapper: MessageMapper,
    private readonly chatGateway: ChatGateway,
  ) {}

  async execute(command: SendMessageCommand): Promise<Result<any>> {
    const { userId, dto, file } = command;

    const chat = await this.chatRepository.findById(dto.chatId);
    if (!chat) return Result.error(null, 'Chat not found');
    if (!chat.members?.includes(userId)) return Result.error(null, 'User not in chat');

    let preparedDto: SendMessageDto = dto;

    // 🔹 Si hay archivo, construye el mensaje DTO desde el servicio
    if (file && dto.messageType === 'audio') {
      const audioDtoResult = await this.fileUploadService.buildAudioMessageDto(userId, dto, file);
      if (!audioDtoResult.isSuccess || !audioDtoResult.data) return Result.failed(null, audioDtoResult.messageDto);
      preparedDto = audioDtoResult.data as SendMessageDto;
    } else if (file) {
      const fileDtoResult = await this.fileUploadService.buildFileMessageDto(userId, dto, file);
      if (!fileDtoResult.isSuccess || !fileDtoResult.data) return Result.failed(null, fileDtoResult.messageDto);
      preparedDto = fileDtoResult.data as SendMessageDto;
    }

    // 🔹 Crear mensaje (solo con datos)
    const message = this.messageMapper.fromDto(userId, preparedDto);
    if (!message.data) return Result.error(null, 'Failed to create message object');

    const saved = await this.messageRepository.save(message.data);
    if(!saved) return Result.error(null, "Failed to save message");
    
    this.chatGateway.server.to(saved.chatId!).emit('new-message', saved);

    return Result.ok({ messageId: saved.id }, 'Message sent successfully');
  }
}
