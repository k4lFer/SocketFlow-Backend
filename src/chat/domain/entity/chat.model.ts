import { AggregateRoot } from "@nestjs/cqrs";
import { ObjectId } from "mongoose";

export class Chat extends AggregateRoot {
  constructor(
    public id?: ObjectId,
    public readonly isGroup?: boolean,
    public readonly members?: string[],
    public readonly name?: string,
    public readonly createdAt?: Date,
    public lastMessageAt?: Date
  ) {
    super();
  }

  static createDirectChat(user1Id: string, user2Id: string): Chat {   
    return new Chat(
      undefined,                 // id (Mongo lo genera)
      false,                     // isGroup
      [user1Id, user2Id],        // members
      undefined,                 // name (no hay nombre para direct chats)
      new Date()                 // createdAt
    );
  }

  static createGroupChat(members: string[], name: string): Chat {
    return new Chat(
      undefined,        // id (Mongo lo genera)
      true,             // isGroup
      members,          // members
      name,             // name
      new Date()        // createdAt
    );
  }

  addMember(userId: string): void {
    if (!this.members?.includes(userId)) {
      this.members?.push(userId);
    }
  }

  removeMember(userId: string): void {
    const index = this.members?.indexOf(userId);
    if (index && index > -1) {
      this.members?.splice(index, 1);
    }
  }

  updateLastMessageAt(): void {
    this.lastMessageAt = new Date();
  }

  isMember(userId: string): boolean {
    return this.members?.includes(userId) || false;
  }

  getOtherMember(userId: string): string | null {
    if (!this.isGroup && this.members && this.members.length === 2) {
      return this.members?.find(member => member !== userId) || null;
    }
    return null;
  }
}
