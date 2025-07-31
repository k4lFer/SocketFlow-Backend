// shared/mappers/base-domain.mapper.ts
export abstract class BaseDomainMapper<TDomain, TPersistence> {
  abstract toDomain(entity: TPersistence): TDomain;
  abstract toPersistence(domain: TDomain): TPersistence;
}