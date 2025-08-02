import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MessageDocument } from "../schemas/message.schema";
import { IMessageRepository } from "../../domain/port/message-repository.interface";
import { Message } from "../../domain/entity/message.model";
import { MessageSchemaMapper } from "../mapper/message.schema.mapper";


@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(
    @InjectModel('message-schema')
    private readonly messageModel: Model<MessageDocument>,
    private readonly mapper: MessageSchemaMapper
  ) {}

  async findById(id: string): Promise<Message | null> {
    const message = await this.messageModel.findById(id).exec();
    return message ? this.mapper.toDomain(message) : null;
  }

  async findByChatId(chatId: string): Promise<Message[]> {
    const messages = await this.messageModel.find({ chatId }).sort({ timestamp: 1 }).exec();
    return messages.map(doc => this.mapper.toDomain(doc));
  }

  async create(message: Message): Promise<Message> {
    const document = this.mapper.toPersistence(message);
    const newMessage = new this.messageModel(document);
    const savedMessage = await newMessage.save();
    return this.mapper.toDomain(savedMessage);
  }

    async update(message: Message): Promise<Message | null> {
      const document = this.mapper.toPersistence(message);
      const updatedMessage = await this.messageModel.findByIdAndUpdate(message.id, document, { new: true }).exec();
      return updatedMessage ? this.mapper.toDomain(updatedMessage) : null;
  }

  async delete(id: string): Promise<void> {
    await this.messageModel.findByIdAndDelete(id).exec();
  }

  // Additional methods for domain operations
  async save(message: Message): Promise<Message> {
    const document = this.mapper.toPersistence(message);
    const savedDocument = await this.messageModel.create(document);
    return this.mapper.toDomain(savedDocument);
  }

  async findMessagesByChatId(chatId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    const documents = await this.messageModel
      .find({ chatId })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    
    return documents.map(doc => this.mapper.toDomain(doc));
  }

  async findUnreadMessagesByUser(chatId: string, userId: string): Promise<Message[]> {
    const documents = await this.messageModel.find({
      chatId,
      sender: { $ne: userId },
      'readReceipts.userId': { $ne: userId }
    }).exec();
    
    return documents.map(doc => this.mapper.toDomain(doc));
  }

  async updateMessageStatus(messageId: string, status: 'sent' | 'delivered' | 'seen' | 'deleted'): Promise<Message | null> {
    const document = await this.messageModel.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    ).exec();
    
    return document ? this.mapper.toDomain(document) : null;
  }

  async addReadReceipt(messageId: string, userId: string): Promise<Message | null> {
    const document = await this.messageModel.findByIdAndUpdate(
      messageId,
      {
        $push: {
          readReceipts: {
            userId,
            readAt: new Date()
          }
        },
        $set: { status: 'seen' }
      },
      { new: true }
    ).exec();
    
    return document ? this.mapper.toDomain(document) : null;
  }
}