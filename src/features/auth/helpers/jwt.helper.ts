import jwt from 'jsonwebtoken';
import { config } from '@/shared/config/config.js';
import type { JwtTokenPayload } from '../types/auth.types.js';

export class JwtHelper {
    static generateAccessToken(payload: JwtTokenPayload): string {
        return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessTokenExpiry });
    }

    static generateRefreshToken(payload: JwtTokenPayload): string {
        return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshTokenExpiry });
    }

    static verifyAccessToken(token: string): JwtTokenPayload {
        return jwt.verify(token, config.jwt.accessSecret) as JwtTokenPayload;
    }

    static verifyRefreshToken(token: string): JwtTokenPayload {
        return jwt.verify(token, config.jwt.refreshSecret) as JwtTokenPayload;
    }
}
