"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwt = decodeJwt;
exports.isTokenExpired = isTokenExpired;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Decodes a JWT token without verification.
 * Useful for client-side or non-security-critical server-side checks.
 */
function decodeJwt(token) {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
}
/**
 * Validates token expiration.
 */
function isTokenExpired(token) {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp)
        return true;
    return Date.now() >= decoded.exp * 1000;
}
