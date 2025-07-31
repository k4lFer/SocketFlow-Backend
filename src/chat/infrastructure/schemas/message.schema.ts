import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MessageMongo {
  @Prop({ type: String, required: true }) // senderId
  sender: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String, required: true }) // chatId (Mongo)
  chat: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: String, enum: ['sent', 'seen'], default: 'sent' })
  status: 'sent' | 'seen';

  @Prop({
    type: {
      filename: String,
      mimetype: String,
      size: Number,
      storageType: String, // 'buffer' | 'gridfs'
      fileId: { type: String, required: false },
      data: Buffer,
    },
    default: null,
  })
  file?: {
    filename: string;
    mimetype: string;
    size: number;
    storageType: 'buffer' | 'gridfs';
    fileId?: string;
    data?: Buffer;
  };
}

export type MessageDocument = MessageMongo & Document;
export const MessageSchema = SchemaFactory.createForClass(MessageMongo);
