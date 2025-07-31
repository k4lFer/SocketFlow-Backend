export class UserSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public socketId: string,
    public ipAddress: string | null,
    public connectedAt: Date,
    public disconnectedAt?: Date | null,
    public isActive: boolean = true,
  ) {}

  static create(userId: string, socketId: string, ip: string): UserSession {
    return new UserSession(
      crypto.randomUUID(),
      userId,
      socketId,
      ip ?? null,
      new Date(),
      null,
      true
    );
  }

  disconnect(): void {
    this.isActive = false;
    this.disconnectedAt = new Date();
  }
}
