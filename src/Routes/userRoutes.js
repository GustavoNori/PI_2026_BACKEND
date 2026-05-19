import { AuthController } from "../Controllers/userController.js";
import express from "express";
import { authMiddleware } from "../utils/auth.js";

const authController = new AuthController();
const router = express.Router();

router.get("/users", authController.getAllUsers);
router.post("/users", authController.createUser);
router.get("/users/:id", authController.getOneUser);
router.put("/users/:id", authMiddleware, authController.updateUser);
router.delete("/users/:id", authMiddleware, authController.deleteUser);
router.post("/login", authController.login);

export default router;