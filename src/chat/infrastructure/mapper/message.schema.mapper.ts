import { Injectable } from "@nestjs/common";
import { BaseDomainMapper } from "src/shared/mappers/base-domain.mapper";
import { Message } from "../../domain/entity/message.model";
import { MessageDocument, MessageMongo } from "../schemas/message.schema";
import { ObjectId } from "mongoose";

@Injectable()
export class MessageSchemaMapper extends BaseDomainMapper<Message, MessageDocument> {
  toDomain(document: MessageDocument): Message {
    const message = new Message(
      document._id as ObjectId,
      document.sender,
      document.content,
      document.chatId,
      document.timestamp,
      document.status,
      document.file,
      document.audio,
      document.messageType,
      document.replyTo,
      document.editedAt,
      document.deletedAt
    );

    // Set read receipts si existen
    if (document.readReceipts && document.readReceipts.length > 0) {
      document.readReceipts.forEach(receipt => {
        if (receipt.userId) {
          message.markAsDelivered(receipt.userId);
          if (receipt.seenAt) {
            message.markAsSeen(receipt.userId);
          }
          if (receipt.deletedAt) {
            message.markAsDeleted(receipt.userId);
          }
        }
      });
    }

    return message;
  }

  toPersistence(domain: Message): MessageDocument {
    const persistence: Partial<MessageMongo> = {
      sender: domain.sender!,
      content: domain.content ?? '',
      chatId: domain.chatId!,
      timestamp: domain.timestamp,
      status: domain.status,
      messageType: domain.messageType,
      replyTo: domain.replyTo,
      editedAt: domain.editedAt,
      deletedAt: domain.deletedAt,
      file: domain.file,
      audio: domain.audio,
      readReceipts: domain.getReadReceipts().map(r => ({
        userId: r.userId,
        readAt: r.readAt,
        deliveredAt: r.deliveredAt,
        seenAt: r.seenAt,
        sentAt: r.sentAt,
        deletedAt: r.deletedAt,
        createdAt: r.createdAt,
      }))
    };

    if (domain.id) {
      (persistence as any)._id = domain.id;
    }

    return persistence as MessageDocument;
  }
}
