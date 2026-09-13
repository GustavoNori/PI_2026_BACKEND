import express from "express";
import { checkoutController } from "../controllers/checkoutController.js";
import { authMiddleware } from "../utils/auth.js";
import { checkRole } from "../middlewares/checkRoles.js";

const checkoutController= new checkoutController();
const checkoutRouter = express.Router();

checkoutRouter.post("/checkout/create", authMiddleware, checkRole("user"), (req, res) => checkoutController.CreateCheckoutPro(req, res));
checkoutRouter.get("/checkout/status", authMiddleware, checkRole("user"), (req, res) => checkoutController.verificarStatusPagamento(req, res));
checkoutRouter.post("/checkout/notificantion/webook", (req, res) => checkoutController.receberWebhook(req, res));

export default checkoutRouter;