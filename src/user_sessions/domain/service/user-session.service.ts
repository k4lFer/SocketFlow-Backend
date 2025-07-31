// domain/service/user-session.service.ts

import { UserSession } from "../entity/user-sessions.model";

export class UserSessionService {
  createSession(userId: string, socketId: string, ip: string): UserSession {
    return UserSession.create(userId, socketId, ip);
  }

  disconnect(session: UserSession): void {
    session.disconnect();
  }
}
