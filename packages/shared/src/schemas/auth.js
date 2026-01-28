"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().min(1, "emailRequired").email("invalidEmail"),
    password: zod_1.z.string().min(1, "passwordRequired"),
});
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "firstNameRequired"),
    lastName: zod_1.z.string().min(1, "lastNameRequired"),
    email: zod_1.z.string().min(1, "emailRequired").email("invalidEmail"),
    password: zod_1.z.string().min(6, "passwordMin"),
});
