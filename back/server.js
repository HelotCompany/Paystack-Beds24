const config = require('./config.js');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { db } = require('./firebase.js');
const paystack = require("paystack-api")(config.PAYSTACK_SECRET_KEY);

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
  try {
    const { email, reference, amount, cy } = req.body;
    const resultDoc = await db.collection('transaction_paystack').add({
      email,
      reference,
      amount,
      cy,
      date: new Date(),
    });
    console.log('config.URL_REDIRECT', config.URL_REDIRECT);
    const resultTransaction = await paystack.transaction.initialize({
      email,
      currency: cy,
      amount: parseInt(amount, 10) * 100,
      callback_url: `${config.URL_REDIRECT}/${reference}`,
      reference: resultDoc.id,
    })
    res.redirect(resultTransaction.data.authorization_url);
  } catch (error) {
    console.error(error)
    res.status(400);
    return res.send({
      error: {
        message: error.message,
      }
    });
  }
})

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