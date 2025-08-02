import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatDocument, ChatMongo } from "../schemas/chat.schema";
import { IChatRepository } from "../../domain/port/chat-repository.interface";
import { Chat } from "../../domain/entity/chat.model";
import { ChatSchemaMapper } from "../mapper/chat.schema.mapper";


@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(
    @InjectModel('chat-schema')
    private readonly chatModel: Model<ChatDocument>,
    private readonly mapper: ChatSchemaMapper
  ) {}

  async findById(id: string): Promise<Chat | null> {
    const chat = await this.chatModel.findById(id).exec();
    return chat ? this.mapper.toDomain(chat) : null;
  }

  async findByMembers(members: string[]): Promise<Chat | null> {
    const chat = await this.chatModel.findOne({ 
      members: { $all: members },
      $expr: { $eq: [{ $size: "$members" }, members.length] }
    }).exec();
    return chat ? this.mapper.toDomain(chat) : null;
  }

  async create(chat: Chat): Promise<Chat> {
    const document = this.mapper.toPersistence(chat);
    const newChat = new this.chatModel(document);
    const savedChat = await newChat.save();
    return this.mapper.toDomain(savedChat);
  }

  async update(chat: Chat): Promise<Chat | null> {
    const document = this.mapper.toPersistence(chat);
    const updatedChat = await this.chatModel.findByIdAndUpdate(chat.id, document, { new: true }).exec();
    return updatedChat ? this.mapper.toDomain(updatedChat) : null;
  }

  async delete(id: string): Promise<void> {
    await this.chatModel.findByIdAndDelete(id).exec();
  }

  // Additional methods for domain operations
  async save(chat: Chat): Promise<Chat> {
    const document = this.mapper.toPersistence(chat);
    const savedDocument = await this.chatModel.create(document);
    return this.mapper.toDomain(savedDocument);
  }

  async findChatsByUserId(userId: string): Promise<Chat[]> {
    const documents = await this.chatModel.find({ 
      members: userId 
    }).sort({ lastMessageAt: -1 }).exec();
    
    return documents.map(doc => this.mapper.toDomain(doc));
  }

  async findDirectChat(userId1: string, userId2: string): Promise<Chat | null> {
    const chat = await this.findByMembers([userId1, userId2]);
    return chat ? chat : null;
  }
}