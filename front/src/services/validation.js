export function emailValidation(email) {
  const REGEX_EMAIL = new RegExp('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\\.[a-zA-Z]{2,}$$');
  return REGEX_EMAIL.test(email);
}

export function validation(infoData, infoError, time) {
  let valid = true;
  if (!emailValidation(infoData.email)) {
    valid = false;
    infoError.email = 'Email address is not valid';
    setTimeout(() => infoError.email = '', time);
  }
  if (!infoData.firstName) {
    valid = false;
    infoError.firstName = 'First name is not valid';
    setTimeout(() => infoError.firstName = '', time);
  }
  if (!infoData.lastName) {
    valid = false;
    infoError.lastName = 'Last name is not valid';
    setTimeout(() => infoError.lastName = '', time);
  }
  infoError.phone = [];
  if (!infoData.callingCode) {
    valid = false;
    infoError.phone.push('Calling Code is not valid');
    setTimeout(() => infoError.phone = '', time);
  }
  if (!infoData.phone) {
    valid = false;
    infoError.phone.push('Phone is not valid');
    setTimeout(() => infoError.phone = '', time);
  }
  if (!infoData.country) {
    valid = false;
    infoError.country = 'Country is not valid';
    setTimeout(() => infoError.country = '', time);
  }
  if (!infoData.paystackKey) {
    valid = false;
    infoError.paystackKey = 'Paystack Public Key';
    setTimeout(() => infoError.paystackKey = '', time);
  }
  return valid;
}