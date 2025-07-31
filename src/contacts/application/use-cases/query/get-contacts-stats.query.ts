import { Query } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";
import { ContactsStatsDto } from "../../dto/in/contacts-stats.dto";

export class GetContactsStatsQuery extends Query<Result<ContactsStatsDto>> {
    constructor(
        public readonly userId: string
    ) {
        super();
    }
}