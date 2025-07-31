import { UserOrmEntity } from "src/user/infrastructure/orm/user.orm-entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('user_sessions')
export class UserSessionOrm {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'char', length: 36 })
  userId: string;

  @Column() socketId: string;

  @Column({ nullable: true }) ipAddress?: string;

  @Column({ type: 'datetime' })
  connectedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  disconnectedAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UserOrmEntity, user => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: UserOrmEntity;
}
