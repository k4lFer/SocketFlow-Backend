import { ApiProperty } from "@nestjs/swagger";

export class SendRequestDto {
    @ApiProperty({
        description: 'ID del usuario al que se envía la solicitud',
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: true
    })
    receiverId: string;
}