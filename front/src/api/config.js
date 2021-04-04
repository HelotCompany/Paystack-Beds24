let config;
if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_BACK === 'staging') {
    config = {
      BASE_URL: 'https://pay-pastack.web.app/',
    };
  } else {
    config = {
      BASE_URL: 'https://pay-pastack.web.app/',
    };
  }
} else {
  config = {
    BASE_URL: 'https://pay-pastack.web.app/',
  };
}
export default config;
