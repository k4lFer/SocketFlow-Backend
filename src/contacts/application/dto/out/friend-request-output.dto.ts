export class FriendRequestOutputDto {
    id: string;
    senderId: string;
    receiverId: string;
    status: string;
    createdAt: Date;
    sender?: {
        id: string;
        username: string;
        fullName?: string;
    };
    receiver?: {
        id: string;
        username: string;
        fullName?: string;
    };
}