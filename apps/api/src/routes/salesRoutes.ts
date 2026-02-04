import { Router } from "express";
import { SalesController } from "../controller/SalesController";
import { authMiddleware } from "../middleware/authMiddleware";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
        );
    },
});

const upload = multer({ storage });

const router = Router();

router.use(authMiddleware);

router.get("/", SalesController.getAllOrders);
router.post("/", SalesController.createOrder);
router.get("/:id", SalesController.getOrder);
router.post("/:id/documents", upload.single("file"), SalesController.addDocument);

export default router;
