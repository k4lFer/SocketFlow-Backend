import { ChatDocument, ChatSchema } from 'src/chat/infrastructure/schemas/chat.schema';
import { Chat } from '../entity/chat.model';

export interface IChatRepository {
    findById(id: string): Promise<Chat | null>;
    findByMembers(members: string[]): Promise<Chat | null>;
    create(chat: Chat): Promise<Chat>;
    update(chat: Chat): Promise<Chat | null>;
    delete(id: string): Promise<void>;
}