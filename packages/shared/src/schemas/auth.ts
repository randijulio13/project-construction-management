import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "emailRequired").email("invalidEmail"),
  password: z.string().min(1, "passwordRequired"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, "firstNameRequired"),
  lastName: z.string().min(1, "lastNameRequired"),
  email: z.string().min(1, "emailRequired").email("invalidEmail"),
  password: z.string().min(6, "passwordMin"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
