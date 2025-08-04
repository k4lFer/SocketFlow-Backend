// src/types/express.d.ts
declare global {
    namespace Express {
        interface Response {
            setRefreshTokenCookie(token: string): void;
            clearRefreshTokenCookie(): void;
        }
    }
}

export {};