import { Inject, Injectable } from "@nestjs/common";
import { Result } from "src/shared/response/result.impl";
import { IUserRepository } from "src/user/domain/port/user-repository.interface";
import { QueryRunner } from "typeorm";
import { UserCreateInput } from "../dto/in/user.create";
import { IService } from "src/shared/common/interface/services.interface";
import { IPasswordHasher } from "src/user/domain/port/password-hasher.interface";
import { User } from "src/user/domain/entity/user.model";

@Injectable()
export class UserCreateService implements IService<UserCreateInput> {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('IPasswordHasher')
        private readonly passwordHasher: IPasswordHasher,
    ) {}   
     
    async execute(input: UserCreateInput, qr?: QueryRunner): Promise<Result<any>> {
        const exists = await this.userRepository.findByEmail(input.email);
        if (exists) return Result.error(null, 'El correo ya está registrado');

        const hashedPassword = await this.passwordHasher.hash(input.password);

        const user = User.create({
            username: input.username,
            email: input.email,
            password: hashedPassword,
            firstName: input.firstName,
            lastName: input.lastName
        });

        const saved = await this.userRepository.save(user, qr);
        if (!saved) return Result.error(null, 'Error al crear el usuario');

        return Result.created(null, 'User created successfully');
    }


}