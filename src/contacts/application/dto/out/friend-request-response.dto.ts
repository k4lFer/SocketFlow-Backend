import { ApiProperty } from "@nestjs/swagger";

export class FriendRequestResponseDto {
    @ApiProperty({
        description: 'ID de la solicitud de amistad',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    requestId: string;

    @ApiProperty({
        description: 'Acción a realizar',
        enum: ['accept', 'reject'],
        example: 'accept'
    })

    action: 'accept' | 'reject';
}