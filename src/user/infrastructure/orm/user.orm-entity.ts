import { UserSessionOrm } from 'src/user_sessions/infrastructure/orm/user-sessions.orm-entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 }) id: string;
  @Column() username: string;
  @Column({ nullable: true }) email: string;
  @Column() password: string;
  @Column({ nullable: true }) firstName?: string;
  @Column({ nullable: true }) lastName?: string;
  @Column({ type: 'text', nullable: true }) bio?: string;

  // 🔴 Elimina socketId y lastSeen

  @OneToMany(() => UserSessionOrm, session => session.user)
  sessions: UserSessionOrm[];
}
