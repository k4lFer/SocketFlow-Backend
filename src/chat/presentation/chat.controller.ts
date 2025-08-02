import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AccessTokenGuard } from 'src/shared/common/guards/access-token.guard';
import { UserActive } from 'src/shared/common/decorators/user-active.decorator';
import { SendMessageCommand } from '../application/use-cases/command/send-message.command';
import { MarkMessageAsSeenCommand } from '../application/use-cases/command/mark-message-as-seen.command';
import { DeleteMessageCommand } from '../application/use-cases/command/delete-message.command';
import { SendMessageDto } from '../application/dto/out/send-message.dto';
import { UserPayload } from 'src/shared/common/interface/user-payload.interface';
import { ResponseHelper } from 'src/shared/response/response.helper';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/shared/response/result.impl';

@Controller('chat')
@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class ChatController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Post('messages')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @UserActive() userId: string,
    @Res() res: Response
  ): Promise<any> {
    const command = new SendMessageCommand(userId, sendMessageDto);
    const result = await this.commandBus.execute(command);
    return ResponseHelper.send(res, result);
  }

  @Post('messages/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: SendMessageDto,
    @UserActive() user: UserPayload,
    @Res() res: Response
  ): Promise<any> {
    const command = new SendMessageCommand(user.userId, data, file);
    const result = await this.commandBus.execute(command);
    return ResponseHelper.send(res, result);
  }

  @Post('messages/audio')
  @UseInterceptors(FileInterceptor('audio'))
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: SendMessageDto,
    @Res() res: Response,
    @UserActive() user: UserPayload
  ): Promise<any> {
    const command = new SendMessageCommand(user.userId, data, file);
    const result = await this.commandBus.execute(command);
    return ResponseHelper.send(res, result);
  }

  @Put('messages/:messageId/seen')
  async markMessageAsSeen(
    @Param('messageId') messageId: string,
    @Body() data: { chatId: string },
    @UserActive() user: UserPayload,
    @Res() res: Response
  ): Promise<any> {

  }

  @Delete('messages/:messageId')
  async deleteMessage(
    @Param('messageId') messageId: string,
    @Body() data: { chatId: string },
    @UserActive() user: UserPayload,
    @Res() res: Response
  ): Promise<any> {
    const command = new DeleteMessageCommand(messageId, user.userId, data.chatId );
    const Result = await this.commandBus.execute(command);
    return ResponseHelper.send(res, Result);
  }

  @Get('messages/:chatId')
  async getMessages(
    @Param('chatId') chatId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @UserActive() user: UserPayload,
    @Res() res: Response
  ): Promise<any> {

  }

  @Get('files/:fileId')
  async getFile(
    @Param('fileId') fileId: string): Promise<any> {
      
  }
} 