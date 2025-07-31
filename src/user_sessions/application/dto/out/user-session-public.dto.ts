export class UserSessionPublicDto {
    userId: string;
    connectedAt: Date;
    disconnectedAt: Date | null;
    isActive: boolean;
}