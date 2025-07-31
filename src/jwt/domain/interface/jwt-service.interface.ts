import { Result } from "src/shared/response/result.impl"

export interface IJwtService {
    // Method to generate accesstoken
    generateAccessToken(payload: { id: string, username: string }): Promise<string | null>
    
    // Method to generate refreshtoken
    generateRefreshToken(payload: { id: string, username: string }): Promise<string | null>

    // Method to generate accesstoken by refresh token
    generateAccessTokenByRefreshToken(input: string): Promise<Result<{ accessToken: string | null }>>
}