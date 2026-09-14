import { PlanController, PlanController } from "../controllers/planController.js";
import express from "express";
import { authMiddleware } from "../utils/auth.js";
import { checkRole } from "../middlewares/checkRoles.js";

const PlanController = new PlanController();
const router = express.Router();

router.get("/planos", authMiddleware, checkRole("admin"), PlanController.getAllPlans);
router.get("/planos/desativados", authMiddleware, checkRole("admin"), PlanController.getAllPlansNotActivated);
router.get("/planos/ativos", authMiddleware, checkRole("admin", "user", "premium"), PlanController.getAllPlansActivated);
router.get("/planos/:id", authMiddleware, checkRole("admin", "user", "premium"), authController.getOnePlan);
router.put("/planos/:id", authMiddleware, checkRole("admin"), authController.updatePlan);
router.delete("/planos/:id", authMiddleware, checkRole("admin"), authController.deletePlan);

export default router;