let config;
if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_BACK === 'staging') {
    config = {
      BASE_URL: 'http://localhost:4242/',
    };
  } else {
    config = {
      BASE_URL: 'http://localhost:4242/',
    };
  }
} else {
  config = {
    BASE_URL: 'http://localhost:4242/',
  };
}
// config = configStaging;
export default config;
