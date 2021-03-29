const config = require('./config.js');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
  const { priceId, email } = req.body;
  const origin = req.get('origin');
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/PaystackBeds24?type=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/PaystackBeds24?type=cancel&session_id={CHECKOUT_SESSION_ID}`,
    });

    res.send({ sessionId: session.id, publishableKey: config.STRIPE_PUBLISHABLE_KEY });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }
});

app.listen(config.PORT, () => console.log(`Running on port ${config.PORT}`));