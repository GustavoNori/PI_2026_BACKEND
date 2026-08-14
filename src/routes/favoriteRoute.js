import { FavoriteController } from "../Controllers/FavoriteController.js";
import express from "express";
import { authMiddleware } from "../utils/auth.js";
import { checkRole } from "../middlewares/checkRoles.js";

const favoriteController = new FavoriteController();
const favoriteRouter = express.Router();

favoriteRouter.post("/favorites/:notice_id", authMiddleware, checkRole("user"), favoriteController.addFavorite);
favoriteRouter.delete("/favorites/:notice_id", authMiddleware, checkRole("user"), favoriteController.removeFavorite);
favoriteRouter.get("/favorites", authMiddleware, checkRole("user"), favoriteController.getUserFavorites);

export default favoriteRouter;