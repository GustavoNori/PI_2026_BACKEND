import { Router } from 'express';
import express from 'express';
import { stripe } from '../utils/stripe.js';
import  db  from '../Database/connection.js';

const router = Router();

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  switch (event.type) {

    case 'customer.subscription.created':
case 'customer.subscription.updated': {
  const startDate = data.current_period_start
    ? new Date(data.current_period_start * 1000)
    : new Date();

 const endDate = data.current_period_end
  ? new Date(data.current_period_end * 1000)
  : data.billing_cycle_anchor
  ? new Date((data.billing_cycle_anchor + 30 * 24 * 60 * 60) * 1000) // +30 dias
  : null;

  const plan = data.items?.data[0]?.price?.lookup_key
    ?? data.items?.data[0]?.price?.nickname
    ?? data.items?.data[0]?.price?.id;

  await db.query(
    `INSERT INTO subscriptions (user_id, plan, status, start_date, end_date, stripe_subscription_id)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       plan = VALUES(plan),
       status = VALUES(status),
       start_date = VALUES(start_date),
       end_date = VALUES(end_date),
       stripe_subscription_id = VALUES(stripe_subscription_id)`,
    [data.metadata.user_id, plan, data.status, startDate, endDate, data.id]
  );
  break;
}

    case 'customer.subscription.deleted': {
      await db.query(
        `UPDATE subscriptions SET status = 'canceled', end_date = NOW()
         WHERE user_id = ?`,
        [data.metadata.user_id]
      );
      break;
    }

    case 'invoice.payment_failed': {
      await db.query(
        `UPDATE subscriptions SET status = 'past_due'
         WHERE user_id = ?`,
        [data.metadata.user_id]
      );
      break;
    }
  }

  res.json({ received: true });
});

export default router;