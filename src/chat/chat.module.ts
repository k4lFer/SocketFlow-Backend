  import { Module } from '@nestjs/common';
  import { MongooseModule } from '@nestjs/mongoose';
  import { CqrsModule } from '@nestjs/cqrs';
  import { JwtModule } from '@nestjs/jwt';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { MessageSchema } from './infrastructure/schemas/message.schema';
  import { ChatSchema } from './infrastructure/schemas/chat.schema';
  import { MessageRepository } from './infrastructure/adapter/message.repository';
  import { ChatRepository } from './infrastructure/adapter/chat.repository';
  import { ChatController } from './presentation/chat.controller';
  import { ChatGateway } from './infrastructure/gateway/chat.gateway';
  import { FileUploadService } from './application/service/file-upload.service';

  import { ChatSchemaMapper } from './infrastructure/mapper/chat.schema.mapper';
  import { ChatResponseMapper } from './application/mapper/chat-response.mapper';

  import { SendMessageCommand } from './application/use-cases/command/send-message.command';
  import { MarkMessageAsSeenCommand } from './application/use-cases/command/mark-message-as-seen.command';
  import { DeleteMessageCommand } from './application/use-cases/command/delete-message.command';

  import { SendMessageHandler } from './application/use-cases/handler/send-message.handler';
  import { MarkMessageAsSeenHandler } from './application/use-cases/handler/mark-message-as-seen.handler';
  import { DeleteMessageHandler } from './application/use-cases/handler/delete-message.handler';
  import { MessageSchemaMapper } from './infrastructure/mapper/message.schema.mapper';
  import { MessageMapper } from './application/mapper/message.mapper';

  @Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'message-schema', schema: MessageSchema },
        { name: 'chat-schema', schema: ChatSchema }
      ]),
      CqrsModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('jwt.accessToken.secret'),
          signOptions: {
            expiresIn: configService.get<string>('jwt.accessToken.expiresIn'),
          },
        }),
        inject: [ConfigService],
      }),
    ],
    controllers: [ChatController],
    providers: [
      // Repositories
      MessageRepository,
      ChatRepository,
      
      // Mappers
      ChatSchemaMapper,
      MessageSchemaMapper,
      ChatResponseMapper,
      MessageMapper,
      
      // Services
      FileUploadService,
      
      // Gateway
      ChatGateway,
      
      // Commands
      SendMessageCommand,
      MarkMessageAsSeenCommand,
      DeleteMessageCommand,
      
      // Handlers
      SendMessageHandler,
      MarkMessageAsSeenHandler,
      DeleteMessageHandler,
      
      // Providers
      { provide: 'IMessageRepository', useExisting: MessageRepository },
      { provide: 'IChatRepository', useExisting: ChatRepository }
    ],
    exports: [ChatGateway]
  })
  export class ChatModule {}
