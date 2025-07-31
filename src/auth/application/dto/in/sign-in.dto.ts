import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
    @ApiProperty({
        required: true,
        type: String,
        example: 'example@example.com'
    })
    email: string;

    @ApiProperty({
        required: true,
        type: String,
        example: 'password'
    })
    password: string;
}