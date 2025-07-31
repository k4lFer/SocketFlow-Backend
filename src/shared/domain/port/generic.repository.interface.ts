import { QueryRunner } from "typeorm";

export interface IGenericRepository<TDomain> {
    findById(id: string): Promise<TDomain | null>;
    save(entity: TDomain, queryRunner?: QueryRunner): Promise<TDomain>;
    update(id: string, entity: TDomain): Promise<TDomain>;
    patch(id: string, partial: Partial<TDomain>): Promise<TDomain>;
    delete(id: string): Promise<boolean>;
    exists(id: string): Promise<boolean>;
}