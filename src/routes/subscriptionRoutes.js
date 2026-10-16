import express from "express";
import { SubscriptionController } from "../controllers/subscriptionController.js";
import { SubscriptionSyncController } from "../controllers/subscriptionSyncController.js";
import { authMiddleware } from "../utils/auth.js";

import { MercadoPagoWebhookController } from "../controllers/mercadoPagoWebhookController.js";

const router = express.Router();
const subscriptionController = new SubscriptionController();
const syncController = new SubscriptionSyncController();
const webhookController = new MercadoPagoWebhookController();

router.post("/webhook", webhookController.handle.bind(webhookController));

// Precisa vir ANTES de "/:planId", senão "sync" seria tratado como planId
router.post(
  "/sync",
  authMiddleware,
  syncController.handle.bind(syncController),
);

router.post(
  "/:planId",
  authMiddleware,
  subscriptionController.create.bind(subscriptionController),
);

export default router;