import { Query } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";
import { UserOutput } from "../../dto/out/user.out";
import { MyProfileOutDto } from "../../dto/out/my-profile.dto";

export class UserProfileQuery extends Query<Result<UserOutput | MyProfileOutDto>> {
    constructor(
        public readonly userId: string,
        public readonly id: string,
    ) {
        super();
    }
}