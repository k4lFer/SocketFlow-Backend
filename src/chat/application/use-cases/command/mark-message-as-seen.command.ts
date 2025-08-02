export class MarkMessageAsSeenCommand {
  constructor(
    public readonly messageId: string,
    public readonly userId: string,
    public readonly chatId: string
  ) {}
} 