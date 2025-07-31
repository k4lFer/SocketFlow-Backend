import { Injectable } from "@nestjs/common";
import { UserQueryService } from "./user.query.service";
import { UserLoginService } from "src/user/domain/service/user-login.service";
import { Result } from "src/shared/response/result.impl";

@Injectable()
export class UserAuthService {
    constructor(
        private readonly userQueryService: UserQueryService,
        private readonly loginService: UserLoginService
    ) {}

    async authenticate(email: string, password: string): Promise<Result<any>> {
        const user = await this.userQueryService.getByEmail(email);
        if (!user) return Result.error(null, 'User not found');

        return this.loginService.validateCredentials(user, password);
    }
}