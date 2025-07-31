import { Query } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";

export class UserProfileQuery extends Query<Result<any>> {
    constructor(public readonly id: string) {
        super();
    }
}