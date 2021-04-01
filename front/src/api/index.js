import HTTP from './HTTP';

export default async function createCheckoutSession(data) {
  const response = await HTTP.post('create-checkout-session', data);
  return response;
}

export async function initSubscription(data) {
  const response = await HTTP.post('init-subscription', data);
  return response;
}

export async function ckeckValidSubscription(userId, subscriptionId) {
  const response = await HTTP.get(`ckeck-valid-subscription/${userId}/${subscriptionId}`);
  return response;
}

export async function checkoutSession(id) {
  const response = await HTTP.get(`checkout-session/${id}`);
  return response;
}

export async function checkoutSubscription(id) {
  const response = await HTTP.get(`checkout-subscription/${id}`);
  return response;
}

export async function createCustomerPortalSession(id) {
  const response = await HTTP.post(`create-customer-portal-session/${id}`);
  return response;
}
