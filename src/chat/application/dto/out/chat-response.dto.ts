import { ObjectId } from "mongoose";

export class ChatResponseDto {
  id: ObjectId;
  isGroup: boolean;
  members: string[];
  name?: string;
  createdAt?: Date;
  lastMessageAt?: Date;
} 