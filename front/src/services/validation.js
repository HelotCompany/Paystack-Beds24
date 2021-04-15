export function emailValidation(email) {
  const REGEX_EMAIL = new RegExp('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\\.[a-zA-Z]{2,}$$');
  return REGEX_EMAIL.test(email);
}

export function validation(
  infoData,
  infoError,
  time,
  fiels = [
    'email',
    'firstName',
    'lastName',
    'callingCode',
    'phone',
    'country',
    'paystackKey'
  ]) {
  let valid = true;
  if (fiels.includes('email') && !emailValidation(infoData.email)) {
    valid = false;
    infoError.email = 'Email address is not valid';
    setTimeout(() => infoError.email = '', time);
  }
  if (fiels.includes('firstName') && !infoData.firstName) {
    valid = false;
    infoError.firstName = 'First name is not valid';
    setTimeout(() => infoError.firstName = '', time);
  }
  if (fiels.includes('lastName') && !infoData.lastName) {
    valid = false;
    infoError.lastName = 'Last name is not valid';
    setTimeout(() => infoError.lastName = '', time);
  }
  /* if (fiels.includes('callingCode') && !infoData.callingCode) {
    if (!Array.isArray(infoError.phone)) infoError.phone = [];
    valid = false;
    infoError.phone.push('Calling Code is not valid');
    setTimeout(() => infoError.phone = '', time);
  } */
  if (fiels.includes('phone') && !infoData.phone) {
    if (!Array.isArray(infoError.phone)) infoError.phone = [];
    valid = false;
    infoError.phone.push('Phone is not valid');
    setTimeout(() => infoError.phone = '', time);
  }
  if (fiels.includes('country') && !infoData.country) {
    valid = false;
    infoError.country = 'Country is not valid';
    setTimeout(() => infoError.country = '', time);
  }
  if (fiels.includes('paystackKey') && !infoData.paystackKey) {
    valid = false;
    infoError.paystackKey = 'Enter Paystack Secret Key';
    setTimeout(() => infoError.paystackKey = '', time);
  }
  if (fiels.includes('currencie') && !infoData.currencie) {
    valid = false;
    infoError.currencie = 'Currencie is not valid';
    setTimeout(() => infoError.currencie = '', time);
  }
  return valid;
}