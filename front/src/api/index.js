import HTTP from './HTTP';

export default async function createCheckoutSession(data) {
  const response = await HTTP.post('create-checkout-session', data);
  return response;
}


export async function checkoutSession(id) {
  const response = await HTTP.get(`checkout-session/${id}`);
  return response;
}
