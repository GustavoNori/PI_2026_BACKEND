
import express from "express";
import { SubscriptionController } from "../controllers/subscriptionController.js";
import { authMiddleware } from "../utils/auth.js";

import { MercadoPagoWebhookController } from "../controllers/mercadoPagoWebhookController.js";

const router = express.Router();
const subscriptionController = new SubscriptionController();
const webhookController = new MercadoPagoWebhookController();

router.post("/webhook", webhookController.handle.bind(webhookController));

router.post("/:planId",authMiddleware,subscriptionController.create.bind(subscriptionController));

export default router;
