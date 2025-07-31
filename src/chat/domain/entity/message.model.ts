export class Message {
  constructor(
    public readonly id: string,
    public readonly sender: string,
    public readonly content: string | null,
    public readonly chatId: string,
    public readonly timestamp: Date,
    public readonly status: 'sent' | 'seen',
    public readonly file?: {
      filename: string;
      mimetype: string;
      size: number;
      storageType: 'buffer' | 'gridfs';
      fileId?: string;
      data?: Buffer;
    }
  ) {}
}
