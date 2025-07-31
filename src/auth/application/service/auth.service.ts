import { Inject, Injectable } from "@nestjs/common";
import { UserAuthService } from "src/user/application/service/user.auth.service";
import { SignInDto } from "../dto/in/sign-in.dto";
import { Result } from "src/shared/response/result.impl";
import { IInputValidator } from "src/shared/common/interface/input.validator.interface";
import { IService } from "src/shared/common/interface/services.interface";
import { UserCreateInput } from "src/user/application/dto/in/user.create";
import { SignUpDto } from "../dto/in/sign-up.dto";
import { IJwtService } from "src/jwt/domain/interface/jwt-service.interface";
import { SignInOutputDto } from "../dto/out/signin-output.dto";

@Injectable()
export class AuthService { 
    constructor(
        private readonly userAuthService: UserAuthService,

        @Inject('SignInValidator')
        private readonly signInValidator: IInputValidator<SignInDto>,

        @Inject('SignUpValidator')
        private readonly signUpValidator: IInputValidator<SignUpDto>,


        @Inject('IService<UserCreateInput>')
        private readonly createUserService: IService<UserCreateInput>,

        @Inject('IJwtService')
        private readonly jwtService: IJwtService,
    ) {}

    async signIn(dto: SignInDto): Promise<Result<any>> {
        if(!await this.signInValidator.isValid(dto)) return Result.failed(null, this.signInValidator.messageDto);

        const authResult = await this.userAuthService.authenticate(dto.email, dto.password);
        if (!authResult.isSuccess) {
            return Result.failed(null, authResult.messageDto);
        }

        const out = new SignInOutputDto();
        out.user_id = authResult.data.user_id;
        out.accessToken = await this.jwtService.generateAccessToken({ id: authResult.data.user_id, username: authResult.data.username });
        out.refreshToken = await this.jwtService.generateRefreshToken({ id: authResult.data.user_id, username: authResult.data.username });

        return Result.ok(out, 'Login successful');
    }

    async signUp(dto: SignUpDto): Promise<Result<any>> {
        if (!await this.signUpValidator.isValid(dto)) {
            return Result.failed(null, this.signUpValidator.messageDto);
        }

        const input: UserCreateInput = {
            username: dto.username,
            email: dto.email,
            password: dto.password,
            firstName: dto.firstName ?? null,
            lastName: dto.lastName ?? null,
        };

        return await this.createUserService.execute(input);
    }

}