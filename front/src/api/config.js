let config;
if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_BACK === 'staging') {
    config = {
      BASE_URL: 'https://backpaystack.herokuapp.com/',
    };
  } else {
    config = {
      BASE_URL: 'https://backpaystack.herokuapp.com/',
    };
  }
} else {
  config = {
    BASE_URL: 'https://backpaystack.herokuapp.com/',
  };
}
export default config;
