import Router from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import pool from './../../databasePG/connection.js';
import sendMail from '../../util/mailService/sendMail.js';

dotenv.config();


const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const webhookRouter = Router();

webhookRouter.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const sessionId = session.id;

    const userId = parseInt(session.metadata.user_id, 10);
    const name = session.metadata.name;
    const address = session.metadata.address;
    const zip = session.metadata.zip;
    const city = session.metadata.city;
    const email = session.metadata.email;
    const cart = JSON.parse(session.metadata.cart);
    const total = session.amount_total / 100;

    try {
      // 🔍 Tjek om ordren allerede er behandlet
      const result = await pool.query(
        'SELECT * FROM orders WHERE stripe_session_id = $1',
        [sessionId]
      );

      if (result.rows.length > 0) {
        const order = result.rows[0];
        if (order.status === 'paid') {
          return res.status(200).send('Allerede behandlet');
        }

        await pool.query(
          'UPDATE orders SET status = $1 WHERE stripe_session_id = $2',
          ['paid', sessionId]
        );

        return res.status(200).send('Opdateret');
      }

      await pool.query(
        `INSERT INTO orders (user_id, name, address, zip, city, email, order_data, total_price, stripe_session_id, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [userId, name, address, zip, city, email, JSON.stringify(cart), total, sessionId, 'paid']
      );

      const orderLines = cart.map((item, idx) => 
        `Person ${idx + 1}: ${item.size}, ${item.color} ${item.hat ? 'Hat' : ''} ${item.glove ? 'Handske' : ''}`
      ).join('\n');

      const mailText = `Tak for din ordre!\n\nOrdreoversigt:\n${orderLines}\n\nPris: ${total} kr.\n\nLevering:\n${name}\n${address}, ${zip} ${city}`;

      await sendMail(email, "Din BarToBar ordre", mailText);

    } catch (err) {
      console.error('❌ DB-fejl eller mail-fejl:', err.message);
      return res.status(500).send('Intern fejl');
    }
  }

  res.status(200).send('✅ Webhook modtaget');
});

export const paymentsRouter = Router();

paymentsRouter.post('/create-checkout-session', async (req, res) => {
  const user = req.session.user;
  const { name, address, zip, city, email, cart, total } = req.body;

  if (!user) return res.status(401).json({ error: 'Bruger ikke logget ind' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'dkk',
            product_data: { name: 'BarToBar ordre' },
            unit_amount: total * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: String(user.userId),
        name, address, zip, city, email,
        cart: JSON.stringify(cart)
      },
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Noget gik galt' });
  }
});


export default router;
