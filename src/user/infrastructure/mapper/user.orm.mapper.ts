import { Injectable } from "@nestjs/common";
import { BaseDomainMapper } from "src/shared/mappers/base-domain.mapper";
import { User } from "src/user/domain/entity/user.model";
import { UserOrmEntity } from "../orm/user.orm-entity";

@Injectable()
export class UserOrmMapper extends BaseDomainMapper<User, UserOrmEntity> {
    toDomain(entity: UserOrmEntity): User {
        return new User (
            entity.id,
            entity.username,
            entity.email,
            entity.password,
            entity.firstName,
            entity.lastName,
            entity.bio
        )
    }
    toPersistence(domain: User): UserOrmEntity {
        const entity = new UserOrmEntity();
        entity.id = domain.id;
        entity.username = domain.username;
        entity.email = domain.email;
        entity.password = domain.password;
        entity.firstName = domain.firstName ?? '';
        entity.lastName = domain.lastName ?? '';
        entity.bio = domain.bio ?? '';
        return entity
    }
}