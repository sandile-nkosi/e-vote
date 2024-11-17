function isEmpty(value) {
  return !value || value.trim() === "";
}

function idNumberLength(value){
  return value.length != 13;
}

function postalNumberLength(value){
  return value.length != 4;
}

function voterCredentialsValid(email, password) {
  return (
    email && email.includes("@") && password && password.trim().length >= 6
  );
}

function voterDetailsValid(
  email,
  password,
  firstName,
  lastName,
  idNumber,
  street,
  city,
  postalCode,
  province
) {
  return (
    voterCredentialsValid(email, password) &&
    !isEmpty(firstName) &&
    !isEmpty(lastName) &&
    !isEmpty(idNumber) &&
    !idNumberLength(idNumber) &&
    !isEmpty(street) &&
    !isEmpty(city) &&
    !isEmpty(postalCode) &&
    !postalNumberLength(postalCode) &&
    !isEmpty(province)
  );
}

function emailMatch(email, confirmEmail) {
  return email === confirmEmail;
}

module.exports = {
  voterDetailsValid,
  emailMatch,
};
