import createCheckoutSession from '@/api';

const priceId = 'price_1Ia26dL5hZhqJmovFqhhI95G';

export async function actionSubscribe(data) {
  const response = (await createCheckoutSession({
    email: data.email,
    priceId,
  })).data;
  const stripe = window.Stripe(response.publishableKey);
  await stripe.redirectToCheckout({
    sessionId: response.sessionId
  });
}

export const NOTHING = '';
