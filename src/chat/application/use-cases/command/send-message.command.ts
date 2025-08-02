import { SendMessageDto } from '../../dto/out/send-message.dto';

export class SendMessageCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: SendMessageDto,
    public readonly file?: Express.Multer.File
  ) {}
} 