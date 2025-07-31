export class CreateUserSessionDto {
  userId: string;
  socketId: string;
  ipAddress?: string | null;
}
