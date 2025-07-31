import { UserOrmEntity } from 'src/user/infrastructure/orm/user.orm-entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('friends')
export class FriendOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'friend_id' })
  friendId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'friend_id' })
  friend: UserOrmEntity;
}