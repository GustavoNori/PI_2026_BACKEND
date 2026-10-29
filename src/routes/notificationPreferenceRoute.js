import { Router } from "express";
import NotificationController from "../controllers/notificationPreferenceController.js";
import { authMiddleware } from "../utils/auth.js"; 

const router = Router();

router.get("/preferences", authMiddleware, NotificationController.getPreferences);
router.put("/preferences", authMiddleware, NotificationController.updatePreferences);

export default router;