// src/Routes/subscriptionRoutes.js
import { Router } from 'express';
import { stripe } from '../utils/stripe.js';
import  db  from '../Database/connection.js';

const router = Router();

router.post('/subscription/checkout', async (req, res) => {
  const { priceId, email, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { user_id: userId },
      },
      success_url: `${process.env.APP_URL}/sucesso`,
      cancel_url: `${process.env.APP_URL}/cancelado`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/subscription/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT id, plan, status, start_date, end_date
       FROM subscriptions
       WHERE user_id = ? AND status = 'active'
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nenhuma assinatura ativa encontrada.' });
    }

    res.json({ subscription: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/subscription/cancel', async (req, res) => {
  const { userId } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nenhuma assinatura ativa encontrada.' });
    }

    const { stripe_subscription_id } = rows[0];

    await stripe.subscriptions.update(stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await db.query(
      `UPDATE subscriptions SET status = 'canceling' WHERE user_id = ?`,
      [userId]
    );

    res.json({ message: 'Assinatura cancelada. O acesso segue até o fim do período pago.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;