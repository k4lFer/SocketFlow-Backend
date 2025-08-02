import { Injectable } from "@nestjs/common";
import { BaseDomainMapper } from "src/shared/mappers/base-domain.mapper";
import { Chat } from "../../domain/entity/chat.model";
import { ChatDocument, ChatMongo } from "../schemas/chat.schema";
import { ObjectId } from "mongoose";

@Injectable()
export class ChatSchemaMapper extends BaseDomainMapper<Chat, ChatDocument> {
  toDomain(document: ChatDocument): Chat {
    return new Chat(
      document._id as ObjectId,
      document.isGroup,
      document.members,
      document.name,
      document.createdAt,
      document.lastMessageAt
    );
  }

  toPersistence(domain: Chat): ChatDocument {
    const persistence: Partial<ChatMongo> = {
    isGroup: domain.isGroup ?? false,
    members: domain.members ?? [],
    name: domain.name,
    createdAt: domain.createdAt ?? new Date(),
    lastMessageAt: domain.lastMessageAt,
    };

    // Si tienes que pasar el id (por ejemplo, al hacer una actualización)
    if (domain.id) {
      (persistence as any)._id = domain.id;
    }

    return persistence as ChatDocument;  
  }
} 