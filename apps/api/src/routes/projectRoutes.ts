import { Router } from "express";
import { ProjectController } from "../controller/ProjectController";
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

// Protect all project routes
router.use(authMiddleware);

router.get("/", ProjectController.getAll);
router.get("/:id", ProjectController.getOne);
router.post(
  "/",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "siteplan", maxCount: 1 },
  ]),
  ProjectController.create,
);
router.put(
  "/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "siteplan", maxCount: 1 },
  ]),
  ProjectController.update,
);
router.delete("/:id", ProjectController.delete);

// Sub-resources
router.post("/:id/documents", ProjectController.addDocument);
router.post("/:id/units", ProjectController.addUnit);
router.put("/:id/units/:unitId", ProjectController.updateUnit);

export default router;
