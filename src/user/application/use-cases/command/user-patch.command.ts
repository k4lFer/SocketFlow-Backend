import { Command } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";
import { UserPatchInput } from "../../dto/in/user.patch";

export class UserPatchCommand extends Command<Result<any>> {
    constructor (
        public readonly id: string,
        public readonly data: UserPatchInput
    ) { 
        super();
    }
}