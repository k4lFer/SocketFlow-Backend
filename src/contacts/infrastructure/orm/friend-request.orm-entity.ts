import { FriendRequestStatus } from 'src/contacts/domain/enum/friend-request.status.enum';
import { UserOrmEntity } from 'src/user/infrastructure/orm/user.orm-entity';
import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('friend_requests')
export class FriendRequestOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ name: 'receiver_id' })
  receiverId: string;

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING
  })
  status: FriendRequestStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'sender_id' })
  sender: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserOrmEntity;
}