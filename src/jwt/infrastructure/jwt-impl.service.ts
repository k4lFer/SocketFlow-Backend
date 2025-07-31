import { Injectable } from "@nestjs/common";
import { IJwtService } from "../domain/interface/jwt-service.interface";
import { Result } from "src/shared/response/result.impl";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "src/shared/common/interface/jwt-payload";

@Injectable()
export class JwtServiceImpl implements IJwtService{
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}
    async generateAccessToken(payload: { id: string, username: string }): Promise<string> {
        // The default jwtService is configured for access tokens via JwtModule.
        return this.jwtService.signAsync(payload);
    }
    async generateRefreshToken(payload: { id: string, username: string }): Promise<string> {
        // For the refresh token, we override the secret and expiration.
        return this.jwtService.signAsync(
            { ...payload, token_type: 'refresh' },
            {
                secret: this.configService.get<string>('jwt.refreshToken.secret'),
                expiresIn: this.configService.get<string>('jwt.refreshToken.expiresIn'),
            }
        );
    }
    async generateAccessTokenByRefreshToken(input: string): Promise<Result<{ accessToken: string | null; }>> {
        try {
            // We must use verifyAsync and provide the specific secret for the refresh token.
            const decoded = await this.jwtService.verifyAsync<JwtPayload & { token_type: string }>(
                input,
                { secret: this.configService.get<string>('jwt.refreshToken.secret') }
            );

            if (decoded.token_type !== 'refresh') {
                return Result.exception({ accessToken: null }, 'Not a refresh token', '');
            }

            const payload: JwtPayload = {
                id: decoded.id,
                username: decoded.username,
            };

            const newAccessToken = await this.generateAccessToken(payload);
            return Result.ok({ accessToken: newAccessToken }, 'Access token refreshed successfully');
        } catch (error) {
            return Result.exception({ accessToken: null }, 'Invalid refresh token', error.toString());
        }
    }
}