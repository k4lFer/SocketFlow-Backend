import { ObjectId } from "mongoose";

export interface ReadReceipt {
  userId: string;
  readAt: Date;
  deliveredAt?: Date;
  sentAt?: Date;
  seenAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
}

export interface FileAttachment {
  filename: string;
  mimetype: string;
  size: number;
  storageType: 'buffer' | 'gridfs' | 's3';
  fileId?: string;
  data?: Buffer;
  url?: string;
  duration?: number;
  thumbnail?: string;
}

export interface AudioMessage {
  duration: number;
  sampleRate: number;
  channels: number;
  format: 'mp3' | 'wav' | 'ogg' | 'm4a';
  isRecording: boolean;
}

export class Message {
  private _readReceipts: ReadReceipt[] = [];
  private _events: any[] = [];

  constructor(
    public readonly id?: ObjectId,
    public readonly sender?: string,
    public readonly content?: string | null,
    public readonly chatId?: string,
    public readonly timestamp: Date = new Date(),
    public readonly status: 'sent' | 'delivered' | 'seen' | 'deleted' = 'sent',
    public readonly file?: FileAttachment,
    public readonly audio?: AudioMessage,
    public readonly messageType: 'text' | 'file' | 'audio' | 'image' | 'video' = 'text',
    public readonly replyTo?: string,
    public readonly editedAt?: Date,
    public readonly deletedAt?: Date
  ) {}

  // Factory: texto
  static createTextMessage(
    sender: string,
    content: string,
    chatId: string,
    replyTo?: string
  ): Message {
    return new Message(
      undefined,
      sender,
      content,
      chatId,
      new Date(),
      'sent',
      undefined,
      undefined,
      'text',
      replyTo
    );
  }

  // Factory: archivo
  static createFileMessage(
    sender: string,
    chatId: string,
    file: FileAttachment,
    replyTo?: string
  ): Message {
    const type = file.mimetype.startsWith('image/') ? 'image' :
                 file.mimetype.startsWith('video/') ? 'video' : 'file';

    return new Message(
      undefined,
      sender,
      null,
      chatId,
      new Date(),
      'sent',
      file,
      undefined,
      type,
      replyTo
    );
  }

  // Factory: audio
  static createAudioMessage(
    sender: string,
    chatId: string,
    file: FileAttachment,
    audio: AudioMessage,
    replyTo?: string
  ): Message {
    return new Message(
      undefined,
      sender,
      null,
      chatId,
      new Date(),
      'sent',
      file,
      audio,
      'audio',
      replyTo
    );
  }

  // Read Receipts
  markAsDelivered(userId: string): void {
    const receipt = this._readReceipts.find(r => r.userId === userId);
    const now = new Date();

    if (receipt) {
      receipt.deliveredAt = now;
    } else {
      this._readReceipts.push({ userId, readAt: now, deliveredAt: now, createdAt: now });
    }
  }

  markAsSeen(userId: string): void {
    const receipt = this._readReceipts.find(r => r.userId === userId);
    const now = new Date();

    if (receipt) {
      receipt.seenAt = now;
      receipt.readAt = now;
    } else {
      this._readReceipts.push({ userId, seenAt: now, readAt: now, createdAt: now });
    }
  }

  markAsDeleted(userId: string): void {
    const receipt = this._readReceipts.find(r => r.userId === userId);
    if (receipt) receipt.deletedAt = new Date();
  }

  getReadReceipts(): ReadReceipt[] {
    return [...this._readReceipts];
  }

  getReadReceiptByUser(userId: string): ReadReceipt | undefined {
    return this._readReceipts.find(r => r.userId === userId);
  }

  // Eventos de dominio
  addEvent(event: any): void {
    this._events.push(event);
  }

  getEvents(): any[] {
    return [...this._events];
  }

  clearEvents(): void {
    this._events = [];
  }
}
