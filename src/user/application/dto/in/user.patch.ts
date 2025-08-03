import { ApiPropertyOptional } from "@nestjs/swagger";

export class UserPatchInput {
    @ApiPropertyOptional(
        {
            type: String,
            description: 'Username',
            example: 'username',
            required: false
        }
    )
    username?: string;

    @ApiPropertyOptional(
        {
            type: String,
            description: 'Email',
            example: 'patch@example',
            required: false
        }
    )
    email?: string;

    @ApiPropertyOptional(
        {
            type: String,
            description: 'Bio',
            example: 'I am a bio',
            required: false
        }
    )
    bio?: string;

    @ApiPropertyOptional(
        {
            type: String,
            description: 'First name',
            example: 'John',
            required: false
        }
    )
    firstName?: string;

    @ApiPropertyOptional(
        {
            type: String,
            description: 'Last name',
            example: 'Doe',
            required: false
        }
    )
    lastName?: string;

}