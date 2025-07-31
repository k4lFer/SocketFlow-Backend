import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SignUpDto {
    @ApiProperty({
        required: true,
        type: String,
        example: 'username'
    })
    username: string;

    @ApiProperty({
        required: true,
        type: String,
        example: 'password'
    })
    password: string;

    @ApiProperty({
        required: true,
        type: String,
        example: 'example@example.com'
    })
    email: string;

    @ApiPropertyOptional({
        required: false,
        type: String,
        example: 'firstName'
    })
    firstName?: string | null;

    @ApiPropertyOptional({
        required: false,
        type: String,
        example: 'lastName'
    })
    lastName?: string | null;

}