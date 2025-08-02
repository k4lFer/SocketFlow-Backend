import { ApiProperty } from "@nestjs/swagger";

export class AcceptFriendRequestDto {
    @ApiProperty({
        description: 'ID de la solicitud de amistad a aceptar',
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: true
    })
    requestId: string
}