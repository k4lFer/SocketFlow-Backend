export class FriendOutputDto {
    id: string;
    userId: string;
    friendId: string;
    createdAt: Date;
    friend: {
        id: string;
        username: string;
        fullname?: string;
        bio?: string;
    };
}