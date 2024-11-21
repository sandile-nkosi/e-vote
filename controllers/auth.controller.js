const Voter = require("../models/Voter");
const validationUtil = require("../util/validation");
const authenticationUtil = require("../util/authentication");
const sessionFlash = require("../util/session-flash");
const checkEmail = require("../middleware/check-email");

// get controllers
function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("auth/login", { sessionData });
}

function getRegister(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      firstName: "",
      lastName: "",
      idNumber: "",
      street: "",
      city: "",
      postalCode: "",
      province: "",
    };
  }
  res.render("auth/register", { sessionData });
}

//post controllers

//login
async function login(req, res) {
  const enteredData = ({ email, password } = req.body);
  let voter;

  try {
    voter = await Voter.findOne({ email: email });
    if (!voter) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "Voter does not exist - please register",
        },
        () => {
          res.status(401).redirect("/api/voter/login");
        }
      );
      return;
    }
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
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Invalid Email or Password - please double check your credentials!",
        ...enteredData,
      },
      () => {
        res.status(401).redirect("/api/voter/login");
      }
    );
  }
}

//logout
function logout(req, res) {
  authenticationUtil.destroyVoterAuthSession(req);
  res.redirect("/");
}

//register
async function register(req, res, next) {
  let emailStatus;
  let existingVoter;

  const enteredData = ({
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
  } = req.body);

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
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Please check your input. Emails must match. Disposable emails are not allowed. Password must be at least 6 characters long, ID number must be 13 digits long, postal code must be 4 digits long.",
        ...enteredData,
      },
      () => {
        res.redirect("/api/voter/register");
      }
    );
    return;
  }

  try {
    emailStatus = await checkEmail(email);
    if (emailStatus.disposable) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage:
            "Email Address not allowed - please use a different one",
          ...enteredData,
        },
        () => {
          res.status(401).redirect("/api/voter/register");
        }
      );
    }
  } catch (error) {
    next(error);
    return;
  }

  try {
    existingVoter = await Voter.findOne({ email: email });

    if (existingVoter) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "Voter Already exists",
          ...enteredData,
        },
        () => {
          res.status(400).redirect("/api/voter/register");
        }
      );
    } else {
      const voter = await Voter.create({
        ...enteredData,
      });

      if (voter) {
        await Voter.updateOne({ _id: voter._id }, { isVerified: true });
        res.status(201).redirect("/api/voter/login");
      } else {
        res.status(400);
      }
    }
  } catch (error) {
    next(error);
    return;
  }
}

module.exports = {
  getLogin,
  getRegister,
  login,
  logout,
  register,
};
