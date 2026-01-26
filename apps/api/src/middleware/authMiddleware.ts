import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { decodeJwt } from "@construction/shared";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Example usage of shared utility
        const decodedInfo = decodeJwt(token);
        console.log("Authenticated User ID:", decodedInfo?.id);

        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
