import { Result } from "src/shared/response/result.impl";
import { QueryRunner } from "typeorm";

export interface IService<TDto> {
    execute(input: TDto, qr?: QueryRunner): Promise<Result<any>>;
}