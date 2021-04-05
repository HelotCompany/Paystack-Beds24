const functions = require('firebase-functions');
const config = functions.config();
const stripe = require('stripe')(config.stripe.sk);
const helper = require('./helper.js');
const Paystack = require('paystack-api');
const cors = require('cors')({origin: true});
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

admin.initializeApp();
const app = express();
const db = admin.firestore();

app.use(express.json());
app.use(cors);
app.options('*', cors);
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/p/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) {
      res.status(400);
      return res.send({
        error: {
          message: 'This user does not exist.',
        }
      });
    }
    if (!doc.data().bed24Key) {
      res.status(400);
      return res.send({
        error: {
          message: 'No existing key',
        }
      });
    }
    const { email, bookid, amount, currency, description } = req.body;
    let isValid = true;
    const mgs = [];
    if (!email) {
      isValid = false;
      mgs.push('The email field does not exist');
    }
    if (!bookid) {
      isValid = false;
      mgs.push('The bookid field does not exist');
    }
    if (!amount) {
      isValid = false;
      mgs.push('The amount field does not exist');
    }
    if (!currency) {
      isValid = false;
      mgs.push('The currency field does not exist');
    }
    if (!description) {
      isValid = false;
      mgs.push('The description field does not exist');
    }
    if (!isValid) {
      res.status(400);
      return res.send({
        error: {
          messages: mgs,
        }
      });
    }
    const resultDoc = await db.collection('transaction_paystack').add({
      email,
      bookId: bookid,
      amount,
      currency,
      description,
      dateCeate: new Date(),
      userId: id,
    });
    const { paystackKey } = doc.data();
    const paystack = Paystack(paystackKey);
    const resultTransaction = await paystack.transaction.initialize({
      email,
      currency: currency,
      amount: parseInt(amount, 10) * 100,
      callback_url: `${config.global.url_redirect}/${id}/${bookid}`,
      reference: resultDoc.id,
      invoice_limit: 1
    })
    return res.redirect(resultTransaction.data.authorization_url);
  } catch (error) {
    res.status(400);
    return res.send({
      error: {
        message: error.message,
      }
    });
  }
})

app.post('/create-checkout-session', async (req, res) => {
  const { userId } = req.body;
  const origin = req.get('origin');
  try {
    const doc = await db.collection('users').doc(userId).get();
    if (!doc.exists) {
      res.status(400);
      return res.send({
        error: {
          message: 'This user does not exist.',
        }
      });
    }
    const user = doc.data();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: user.customerId,
      subscription_data: {
        trial_period_days:  1
      },
      line_items: [
        {
          price: config.stripe.price_k,
          quantity: 1,
        },
      ],
      success_url: `${origin}/RedirectPayStripe/${userId}?paysuccess=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/RedirectPayStripe/${userId}?session_id={CHECKOUT_SESSION_ID}`,
    });
    await db.collection('users').doc(userId).update({
      lastSubscriptionId: session.id,
    });
    res.send({ sessionId: session.id, publishableKey: config.stripe.pk });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }
});

app.get('/ckeck-valid-subscription/:id/:subscriptionId', async (req, res) => {
  try {
    const {
      id,
      subscriptionId,
    } = req.params;
    let isValid = false;
    const querySnapshot = await db.collection('subscriptions')
      .where('userId', '==', id)
      .where('subscriptionId', '==', subscriptionId)
      .where('isValid', '==', true)
      .get();
    querySnapshot.forEach(() => {
      isValid = true;
    });
    res.send({ isValid });
  } catch (error) {
    res.status(400);
    return res.send({
      error: {
        message: error.message,
      }
    });
  }
});

app.post('/init-subscription', async (req, res) => {
  try {
    const {
      phone,
      email,
      userId,
      firstName,
      lastName,
      paystackKey,
      callingCode,
      country
    } = req.body;
    const customer = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
      phone,
    });
    const origin = req.get('origin');
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customer.id,
      subscription_data: {
        trial_period_days:  config.stripe.trial_period_days
      },
      line_items: [
        {
          price: config.stripe.price_k,
          quantity: 1,
        },
      ],
      success_url: `${origin}/RedirectPayStripe?paysuccess=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/RedirectPayStripe?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId,
      }
    });
    await db.collection('users').doc(userId).set({
      phone,
      email,
      userId,
      firstName,
      lastName,
      paystackKey,
      dateCeate: new Date(),
      customerId: customer.id,
      callingCode,
      country
    });
    res.send({ sessionId: session.id, publishableKey: config.stripe.pk });
  } catch (error) {
    res.status(400);
    return res.send({
      error: {
        message: error.message,
      }
    });
  }
});

app.get('/checkout-session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await stripe.checkout.sessions.retrieve(id);
    const doc = await db.collection('users').doc(session.metadata.userId).get();
    if (!doc.exists) {
      res.status(400);
      return res.send({
        error: {
          message: 'This user does not exist.',
        }
      });
    }
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

app.get('/checkout-subscription/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await stripe.subscriptions.retrieve(id);
    res.send(subscription);
  } catch (error) {
    res.status(400);
    return res.send({
      error: {
        message: error.message,
      }
    });
  }
});

app.post('/create-customer-portal-session/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) {
      res.status(400);
      return res.send({
        error: {
          message: 'This user does not exist.',
        }
      });
    }
    const origin = req.get('origin');
    const session = await stripe.billingPortal.sessions.create({
      customer: doc.data().customerId,
      return_url: origin,
    });
    res.send(session.url);
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
    case 'invoice.payment_failed':
      console.log('type =>', type);
      console.log('data.object.id =>', data);
      var querySnapshot = await db.collection('users').where('subscriptionId', '==', data.object.id).get();
      var user = null;
      querySnapshot.forEach((doc) => {
        user = doc.data();
      });
      if (!user) {
        res.status(400);
        return res.send({
          error: {
            message: 'This subscription does not exist in the database',
          }
        });
      }
      await db.collection('users').doc(user.userId)
        .update({
          bed24Key: '',
          payementUrl: '',
        });
      break;
    case 'invoice.paid':
      console.log('type =>', type);
      console.log('data.object.id =>', data);
      querySnapshot = await db.collection('users').where('subscriptionId', '==', data.object.id).get();
      user = null;
      querySnapshot.forEach((doc) => {
        user = doc.data();
      });
      if (!user) {
        res.status(400);
        return res.send({
          error: {
            message: 'This subscription does not exist in the database',
          }
        });
      }
      await db.collection('users').doc(user.userId)
        .update({
          bed24Key: helper.generateHexString(60),
          payementUrl: `${req.protocol}://${req.get('host')}/p/${user.userId}`,
        });
      break;
    default:
  }
  res.sendStatus(200);
});

exports.app = functions.https.onRequest(app);
