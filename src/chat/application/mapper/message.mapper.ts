import { Message } from "src/chat/domain/entity/message.model";
import { SendMessageDto } from "../dto/out/send-message.dto";
import { Result } from "src/shared/response/result.impl";
import { Injectable } from "@nestjs/common";

// src/chat/application/mapper/message.mapper.ts
@Injectable()
export class MessageMapper {
    fromDto(senderId: string, dto: SendMessageDto): Result<Message>{
      switch (dto.messageType) {
        case 'text':
          if (!dto.content) return Result.error<Message>(null, 'Text message must have content');
          return Result.ok(Message.createTextMessage(senderId, dto.content, dto.chatId, dto.replyTo), 'Message created successfully');
  
        case 'file':
        case 'image':
        case 'video':
          if (!dto.file) return Result.error<Message>(null, 'File message must have file data');
          return Result.ok(Message.createFileMessage(senderId, dto.chatId, {
            filename: dto.file.filename,
            mimetype: dto.file.mimetype,
            size: dto.file.size,
            storageType: dto.file.storageType,
            fileId: dto.file.fileId,
            duration: dto.file.duration,
            thumbnail: dto.file.thumbnail
          }, dto.replyTo), 'File created successfully');
  
        case 'audio':
          if (!dto.file || !dto.audio) throw new Error('Audio message requires file and audio data');
          return Result.ok(Message.createAudioMessage(senderId, dto.chatId, {
            filename: dto.file.filename,
            mimetype: dto.file.mimetype,
            size: dto.file.size,
            storageType: dto.file.storageType,
            fileId: dto.file.fileId,
            duration: dto.file.duration,
          }, {
            duration: dto.audio.duration,
            sampleRate: dto.audio.sampleRate,
            channels: dto.audio.channels,
            format: dto.audio.format,
            isRecording: dto.audio.isRecording
          }, dto.replyTo), 'Audio created successfully');
  
        default:
          throw new Error('Unsupported message type');
      }
    }
  }
  