import jwt from "jsonwebtoken";

export interface DecodedToken {
    id: number;
    email: string;
    iat?: number;
    exp?: number;
}

/**
 * Decodes a JWT token without verification.
 * Useful for client-side or non-security-critical server-side checks.
 */
export function decodeJwt(token: string): DecodedToken | null {
    try {
        return jwt.decode(token) as DecodedToken;
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
}

/**
 * Validates token expiration.
 */
export function isTokenExpired(token: string): boolean {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) return true;
    
    return Date.now() >= decoded.exp * 1000;
}
