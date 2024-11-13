const axios = require("axios");

async function checkEmail(email) {
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.USERCHECKAPI}`,
    },
  };

  try {
    const response = await axios.get(
      `https://api.usercheck.com/email/${email}`,
      options
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = checkEmail;
