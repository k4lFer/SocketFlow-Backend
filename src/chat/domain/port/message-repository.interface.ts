import { MessageDocument } from "src/chat/infrastructure/schemas/message.schema";
import { Message } from "../entity/message.model";

export interface IMessageRepository {
    save(message: Message): Promise<Message>;
    findById(id: string): Promise<Message | null>;
    findByChatId(chatId: string): Promise<Message[]>;
    create(message: Message): Promise<Message>;
    update(message: Message): Promise<Message | null>;
    delete(id: string): Promise<void>;
}