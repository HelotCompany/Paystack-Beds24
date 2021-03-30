const config = require('./config.js');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { db } = require('./firebase.js');
const Paystack = require('paystack-api');

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/p/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("users").doc(id).get();
    if (!doc.exists) {
      res.status(400);
      return res.send({
        error: {
          message: 'This user does not exist.',
        }
      });
    }
    const { email, bookid, amount, currency, description } = req.body;
    const resultDoc = await db.collection('users').doc(id).collection('transaction_paystack').add({
      email,
      bookId: bookid,
      amount,
      currency,
      description,
      dateCeate: new Date(),
    });
    const { paystackKey } = doc.data();
    const paystack = Paystack(paystackKey);
    const resultTransaction = await paystack.transaction.initialize({
      email,
      currency: currency,
      amount: parseInt(amount, 10) * 100,
      callback_url: `${config.URL_REDIRECT}/${id}/${bookid}`,
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
  const { priceId, email, userId } = req.body;
  const origin = req.get('origin');
  try {
    const doc = await db.collection("users").doc(userId).get();
    if (!doc.exists) {
      res.status(400);
      return res.send({
        error: {
          message: 'This user does not exist.',
        }
      });
    }
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
      success_url: `${origin}/RedirectPayStripe/${userId}?paysuccess=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/RedirectPayStripe/${userId}?session_id={CHECKOUT_SESSION_ID}`,
    });
    await db.collection("users").doc(userId).update({
      sessionId: session.id,
      dateSession: new Date(),
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

app.get('/checkout-session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await stripe.checkout.sessions.retrieve(id);
    res.send(session);
  } catch (error) {
    res.status(400);
    return res.send({
      error: {
        message: error.message,
      }
    });
  }
});

app.post('/webhook', async (req, res) => {
  const { data, type } = req.body
  switch (type) {
    case 'checkout.session.completed':
      console.log(data);
      break;
    case 'invoice.paid':
      console.log(data);
      break;
    case 'invoice.payment_failed':
      console.log(data);
      break;
    default:
  }
  res.sendStatus(200);
});

app.listen(config.PORT, () => console.log(`Running on port ${config.PORT}`));