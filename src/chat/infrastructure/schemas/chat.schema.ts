import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatMongo {
  @Prop({ type: Boolean, default: false })
  isGroup: boolean;

  @Prop({ type: [String], required: true }) // userId como string (de MariaDB)
  members: string[];

  @Prop({ type: String })
  name?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export type ChatDocument = ChatMongo & Document;
export const ChatSchema = SchemaFactory.createForClass(ChatMongo);
