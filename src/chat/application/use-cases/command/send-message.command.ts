import { Command } from '@nestjs/cqrs';
import { SendMessageDto } from '../../dto/out/send-message.dto';
import { Result } from 'src/shared/response/result.impl';

export class SendMessageCommand extends Command<Result<any>> {
  constructor(
    public readonly userId: string,
    public readonly dto: SendMessageDto,
    public readonly file?: Express.Multer.File
  ) {
    super();
  }
} 