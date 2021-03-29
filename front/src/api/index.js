import HTTP from './HTTP';

export default async function createCheckoutSession(data) {
  const response = await HTTP.post('create-checkout-session', data);
  return response;
}
