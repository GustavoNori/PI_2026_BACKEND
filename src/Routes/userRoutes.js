import { AuthController } from "../Controllers/userController.js";
import express from "express";
import { authMiddleware } from "../utils/auth.js";
import { checkRole } from "../middlewares/checkRoles.js";

const authController = new AuthController();
const router = express.Router();

router.post("/login", authController.login);
router.post("/users", authController.createUser);

router.get("/users", authMiddleware, checkRole("admin"), authController.getAllUsers);
router.get("/users/:id", authMiddleware, checkRole("admin", "user"), authController.getOneUser);
router.put("/users/:id", authMiddleware, checkRole("admin", "user"), authController.updateUser);
router.delete("/users/:id", authMiddleware, checkRole("admin"), authController.deleteUser);

router.patch("/users/:id/promote", authMiddleware, checkRole("admin"), authController.promoteToAdmin);

export default router;