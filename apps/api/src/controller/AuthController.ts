import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { RegisterRequest, LoginRequest, AuthResponse, UpdatePasswordRequest, ApiResponse, UserSession } from "@construction/shared";

const userRepository = AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export class AuthController {
    static register = async (req: Request, res: Response) => {
        try {
            const { firstName, lastName, email, password }: RegisterRequest = req.body;

            // Check if user exists
            const existingUser = await userRepository.findOneBy({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = new User();
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.password = hashedPassword;

            await userRepository.save(user);

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error in registration", error });
        }
    };

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password }: LoginRequest = req.body;

            // Find user
            const user = await userRepository.findOne({
                where: { email },
                select: ["id", "firstName", "lastName", "email", "password"]
            });

            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: "1d" }
            );

            const authResponse: AuthResponse = {
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            };
            res.json(authResponse);
        } catch (error) {
            res.status(500).json({ message: "Error in login", error });
        }
    };

    static getProfile = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const user = await userRepository.findOneBy({ id: userId });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const authResponse: ApiResponse<UserSession> = {
                data: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            };
            res.json(authResponse);
        } catch (error) {
            res.status(500).json({ message: "Error fetching profile", error });
        }
    };

    static updatePassword = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { currentPassword, newPassword }: UpdatePasswordRequest = req.body;

            const user = await userRepository.findOne({
                where: { id: userId },
                select: ["id", "password"]
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid current password" });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await userRepository.save(user);

            res.json({ message: "Password updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating password", error });
        }
    };
}
