// src/shared/middleware/cookie.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CookieMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Extender Response con métodos para manejar refresh token cookies
        res.setRefreshTokenCookie = (token: string) => {
            const cookieOptions = {
                httpOnly: true, // Previene acceso desde JavaScript del cliente
                secure: process.env.NODE_ENV === 'development', // Solo HTTPS en producción
                sameSite: 'strict' as const, // Protección CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
                path: '/', // Disponible en toda la aplicación
            };

            res.cookie('refreshToken', token, cookieOptions);
        };

        res.clearRefreshTokenCookie = () => {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                sameSite: 'strict' as const,
                path: '/',
            });
        };

        next();
    }
}