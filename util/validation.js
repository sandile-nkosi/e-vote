function isEmpty(value) {
  return !value || value.trim() === "";
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
    !isEmpty(street) &&
    !isEmpty(city) &&
    !isEmpty(postalCode) &&
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
