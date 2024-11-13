const Voter = require("../models/Voter");
const validationUtil = require("../util/validation");
const authenticationUtil = require("../util/authentication");
const checkEmail = require("../middleware/check-email");

// get controllers
function getLogin(req, res) {
  res.render("voter/login");
}

function getRegister(req, res) {
  res.render("voter/register");
}

//post controllers

//login
async function login(req, res) {
  const { email, password } = req.body;
  let voter;

  try {
    voter = await Voter.findOne({ email: email });
  } catch (error) {
    next(error);
    return;
  }

  if (voter && (await voter.matchPassword(password))) {
    res.status(201);
    authenticationUtil.createVoterSession(req, voter, () => {
      res.redirect("/");
    });
  } else {
    res.status(401).redirect("/api/voter/login");
    console.log("Invalid Email or Password");
  }
}

//logout
function logout(req, res) {
  authenticationUtil.destroyVoterAuthSession(req);
  res.redirect("/");
}

//register
async function register(req, res) {
  let emailStatus;
  let existingVoter;

  const {
    email,
    confirmEmail,
    password,
    firstName,
    lastName,
    idNumber,
    street,
    city,
    postalCode,
    province,
  } = req.body;

  if (
    !validationUtil.voterDetailsValid(
      email,
      password,
      firstName,
      lastName,
      idNumber,
      street,
      city,
      postalCode,
      province
    ) ||
    !validationUtil.emailMatch(email, confirmEmail)
  ) {
    res.redirect("/api/voter/register");
    return;
  }

  try {
    emailStatus = await checkEmail(email);
    if (emailStatus.disposable) {
      console.log("Email Address not allowed - please use a different one");
      return res.status(401).redirect("/api/voter/register");
    }
  } catch (error) {
    next(error);
    return;
  }

  try {
    existingVoter = await Voter.findOne({ email: email });

    if (existingVoter) {
      console.log("Voter Already exists");
      return res.status(400).redirect("/api/voter/register");
    } else {
      const voter = await Voter.create({
        email,
        password,
        firstName,
        lastName,
        idNumber,
        street,
        city,
        postalCode,
        province,
      });

      if (voter) {
        res.status(201).redirect("/api/voter/login");
      } else {
        res.status(400);
      }
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLogin,
  getRegister,
  login,
  logout,
  register,
};
