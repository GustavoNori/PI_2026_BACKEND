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
      const startDate = new Date(data.current_period_start * 1000);
      const endDate = new Date(data.current_period_end * 1000);
      const plan = data.items.data[0].price.lookup_key ?? data.items.data[0].price.id;

      await db.query(
        `INSERT INTO subscriptions (user_id, plan, status, start_date, end_date)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           plan = VALUES(plan),
           status = VALUES(status),
           start_date = VALUES(start_date),
           end_date = VALUES(end_date)`,
        [data.metadata.user_id, plan, data.status, startDate, endDate]
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