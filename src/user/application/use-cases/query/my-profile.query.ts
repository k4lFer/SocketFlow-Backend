import { Query } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";
import { MyProfileOutDto } from "../../dto/out/my-profile.dto";

export class MyProfileQuery extends Query<Result<MyProfileOutDto>> {
    constructor(public readonly id: string) {
        super();
    }
}