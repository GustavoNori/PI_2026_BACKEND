import { AuthController } from "../controllers/userController.js";
import express from "express";
import { authMiddleware } from "../utils/auth.js";
import { checkRole } from "../middlewares/checkRoles.js";

const authController = new AuthController();
const router = express.Router();

router.post("/login", authController.login);
router.post("/users", authController.createUser);

router.get("/users", authMiddleware, checkRole("admin"), authController.getAllUsers);
router.get("/users/:id", authMiddleware, checkRole("admin", "user", "premium"), authController.getOneUser);
router.put("/users/:id", authMiddleware, checkRole("admin", "user", "premium"), authController.updateUser);
router.delete("/users/:id", authMiddleware, checkRole("admin"), authController.deleteUser);

router.patch("/users/:id/promote", authMiddleware, checkRole("admin"), authController.promoteToAdmin);
router.patch("/users/:id/demote", authMiddleware, checkRole("admin"), authController.demoteToUser);

router.get("/users/:id/subscription", authMiddleware, checkRole("admin", "user", "premium"), authController.getUserSubscription);
router.post("/users/:id/activate-premium", authMiddleware, checkRole("admin", "user", "premium"), authController.activatePremium);


router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);

export default router;