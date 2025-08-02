import { Injectable } from "@nestjs/common";
import { BaseResponseMapper } from "src/shared/mappers/base-response.mapper";
import { Chat } from "../../domain/entity/chat.model";
import { ChatResponseDto } from "../dto/out/chat-response.dto";
import { ObjectId } from "mongoose";


@Injectable()
export class ChatResponseMapper implements BaseResponseMapper<Chat, ChatResponseDto> {
  toResponse(domain: Chat): ChatResponseDto {
    return {
      id: domain.id as ObjectId,
      isGroup: domain.isGroup ?? false,
      members: domain.members ?? [],
      name: domain.name,
      createdAt: domain.createdAt,
      lastMessageAt: domain.lastMessageAt,
    }

  }

  toListResponse(domains: Chat[]): ChatResponseDto[] {
    return domains.map(domain => this.toResponse(domain));
  }
} 