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
    BASE_URL: 'https://backlino004.herokuapp.com/',
  };
}
// config = configStaging;
export default config;
