const Voter = require("../models/Voter");
const validationUtil = require("../util/validation");
const authenticationUtil = require("../util/authentication");

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

  const voter = await Voter.findOne({ email: email });

  if (voter && (await voter.matchPassword(password))) {
    res.status(201);
    authenticationUtil.createVoterSession(req, voter, ()=>{
      res.redirect("/");
    })
  } else {
    res.status(401).redirect("/api/voter/login");
    console.log("Invalid Email or Password");
  }
}

//register
async function register(req, res) {
  const {
    email,
    confirmEmail,
    password,
    firstName,
    lastName,
    idNumber,
    street,
    city,
    postal,
  } = req.body;

  if (
    !validationUtil.voterCredentialsValid(
      email,
      password,
      firstName,
      lastName,
      idNumber,
      street,
      city,
      postal
    ) ||
    !validationUtil.emailMatch(email, confirmEmail)
  ) {
    res.redirect("/api/voter/register");
    return;
  }

  const existingVoter = await Voter.findOne({ email: email });

  if (existingVoter) {
    res.status(400);
    console.log("Voter Already exists");
  } else {
    const voter = await Voter.create({
      email,
      password,
      firstName,
      lastName,
      idNumber,
      street,
      city,
      postal,
    });

    if (voter) {
      res.status(201).redirect("/api/voter/login");
    } else {
      res.status(400);
    }
  }
}

module.exports = {
  getLogin,
  getRegister,
  login,
  register,
};
