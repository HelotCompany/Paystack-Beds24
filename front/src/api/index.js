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

export async function checkoutPaystackBooking(data) {
  const response = await HTTP.post('check-paystack-booking', data);
  return response;
}

export async function checkoutSubscription(id) {
  const response = await HTTP.get(`checkout-subscription/${id}`);
  return response;
}

export async function createSession(id) {
  const response = await HTTP.post(`create-session/${id}`);
  return response;
}

export async function createCustomerPortalSession(id) {
  const response = await HTTP.post(`create-customer-portal-session/${id}`);
  return response;
}

const BASE_URL_CONTRIE = 'https://restcountries.eu/rest/v2/';

export async function getAllContries() {
  const response = await HTTP.get(`${BASE_URL_CONTRIE}all?fields=name;currencies;callingCodes;alpha3Code`)
  return response;
}
