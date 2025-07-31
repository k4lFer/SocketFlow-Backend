import { Query } from "@nestjs/cqrs";
import { PagedResult } from "src/shared/domain/paged.result";
import { Result } from "src/shared/response/result.impl";

export class SearchUsersQuery extends Query<Result<PagedResult<any>>>{
    constructor(
        public readonly userId: string,
        public readonly searchTerm: string | null = null,
        public readonly pageNumber: number = 1,
        public readonly pageSize: number = 10
    ) {
        super();
    }
}