let config;
if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_BACK === 'staging') {
    config = {
      BASE_URL: 'https://us-central1-paystack-for-beds24.cloudfunctions.net/app/',
    };
  } else {
    config = {
      BASE_URL: 'https://us-central1-paystack-for-beds24.cloudfunctions.net/app/',
    };
  }
} else {
  config = {
    BASE_URL: 'http://localhost:5001/paystack-for-beds24/us-central1/app/',
  };
}
export default config;
