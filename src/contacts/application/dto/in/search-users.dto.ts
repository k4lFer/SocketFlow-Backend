import { ApiPropertyOptional } from "@nestjs/swagger";

export class SearchUsersDto {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    relationshipStatus: 'none' | 'friends' | 'request_sent' | 'request_received';
    canSendRequest: boolean;
}