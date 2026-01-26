import { Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Apply auth middleware to all user routes
router.use(authMiddleware);

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await userRepository.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// Create a user
router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        
        await userRepository.save(user);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error });
    }
});

export default router;
