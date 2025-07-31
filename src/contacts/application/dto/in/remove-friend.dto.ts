import { ApiProperty } from "@nestjs/swagger";

export class RemoveFriendDto {
    @ApiProperty({
        description: 'ID del amigo a eliminar',
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: true
    })
    friendId: string;
}