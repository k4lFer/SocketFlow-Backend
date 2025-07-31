export class UserSearchDto {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    relationshipStatus: 'none' | 'friends' | 'request_sent' | 'request_received';
    canSendRequest: boolean;
}