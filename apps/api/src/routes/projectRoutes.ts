import { Router } from "express";
import { ProjectController } from "../controller/ProjectController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Protect all project routes
router.use(authMiddleware);

router.get("/", ProjectController.getAll);
router.get("/:id", ProjectController.getOne);
router.post("/", ProjectController.create);
router.put("/:id", ProjectController.update);
router.delete("/:id", ProjectController.delete);

// Sub-resources
router.post("/:id/documents", ProjectController.addDocument);
router.post("/:id/units", ProjectController.addUnit);

export default router;
