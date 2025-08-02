import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserOrmEntity } from 'src/user/infrastructure/orm/user.orm-entity';

@Schema()
export class ReadReceiptMongo {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Date, default: Date.now })
  readAt: Date;

  @Prop({ type: Date, default: null })
  deliveredAt?: Date;

  @Prop({ type: Date, default: null })
  sentAt?: Date;

  @Prop({ type: Date, default: null })
  seenAt?: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

@Schema()
export class FileAttachmentMongo {
  @Prop({ type: String, required: true })
  filename: string;

  @Prop({ type: String, required: true })
  mimetype: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ type: String, enum: ['buffer', 'gridfs', 's3'], default: 'buffer' })
  storageType: 'buffer' | 'gridfs' | 's3';

  @Prop({ type: String, required: false })
  fileId?: string;

  @Prop({ type: Buffer, required: false })
  data?: Buffer;

  @Prop({ type: String, required: false })
  url?: string;

  @Prop({ type: Number, required: false })
  duration?: number;

  @Prop({ type: String, required: false })
  thumbnail?: string;
}

@Schema()
export class AudioMessageMongo {
  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: Number, required: true })
  sampleRate: number;

  @Prop({ type: Number, required: true })
  channels: number;

  @Prop({ type: String, enum: ['mp3', 'wav', 'ogg', 'm4a'], required: true })
  format: 'mp3' | 'wav' | 'ogg' | 'm4a';

  @Prop({ type: Boolean, default: false })
  isRecording: boolean;
}

@Schema()
export class MessageMongo {

  @Prop({ type: String, required: true }) // senderId
  sender: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String, required: true }) // chatId (Mongo)
  chatId: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: String, enum: ['sent', 'delivered', 'seen', 'deleted'], default: 'sent' })
  status: 'sent' | 'delivered' | 'seen' | 'deleted';

  @Prop({ type: String, enum: ['text', 'file', 'audio', 'image', 'video'], default: 'text' })
  messageType: 'text' | 'file' | 'audio' | 'image' | 'video';

  @Prop({ type: String, required: false })
  replyTo?: string;

  @Prop({ type: Date, required: false })
  editedAt?: Date;

  @Prop({ type: Date, required: false })
  deletedAt?: Date;

  @Prop([ReadReceiptMongo])
  readReceipts: ReadReceiptMongo[];

  @Prop({ type: FileAttachmentMongo, required: false })
  file?: FileAttachmentMongo;

  @Prop({ type: AudioMessageMongo, required: false })
  audio?: AudioMessageMongo;
}

export type MessageDocument = MessageMongo & Document;
export const MessageSchema = SchemaFactory.createForClass(MessageMongo);
