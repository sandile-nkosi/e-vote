const Candidate = require("../models/Candidate");
const Comissioner = require("../models/Comissioner");
const authenticationUtil = require("../util/authentication");
const sessionFlash = require("../util/session-flash");

// get controllers
function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("comissioner/login", { sessionData });
}

async function getCandidates(req, res, next) {
  try {
    const candidates = await Candidate.find({});
    res.render("comissioner/candidates", { candidates });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewCandidate(req, res) {
  res.render("comissioner/new-candidate");
}

async function getUpdateCandidate(req, res, next) {
  try {
    const candidate = await Candidate.findById(req.params.id).exec();
    res.render("comissioner/update-candidate", { candidate });
  } catch (error) {
    error.code = 404;
    next(error);
  }
}

function getElections(req, res) {
  res.render("comissioner/elections");
}

//post controllers

//login
async function login(req, res) {
  const enteredData = ({ email, password } = req.body);
  let comissioner;

  try {
    comissioner = await Comissioner.findOne({ email: email });
    if (!comissioner) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "Comissioner does not exist - please register",
        },
        () => {
          res.status(404).redirect("/api/comissioner/login");
        }
      );
      return;
    }
  } catch (error) {
    next(error);
    return;
  }

  if (comissioner && (await comissioner.matchPassword(password))) {
    res.status(201);
    authenticationUtil.createComissionerSession(req, comissioner, () => {
      res.redirect("/api/comissioner/candidates");
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
        res.status(401).redirect("/api/comissioner/login");
      }
    );
  }
}

//logout
function logout(req, res) {
  authenticationUtil.destroyComissionerAuthSession(req);
  res.redirect("/");
}

async function createNewCandidate(req, res, next) {
  const { fullName, politicalParty, description } = req.body;
  const image = req.file.filename;
  const imagePath = `candidate-data/images/${image}`;
  const imageUrl = `/candidates/assets/images/${image}`;

  try {
    const candidate = await Candidate.create({
      fullName,
      image,
      imagePath,
      imageUrl,
      politicalParty,
      description,
    });

    if (candidate) {
      res.status(201).redirect("/api/comissioner/candidates");
    } else {
      res.status(400);
    }
  } catch (error) {
    next(error);
  }
}

async function updateCandidate(req, res, next) {
  const { fullName, politicalParty, description } = req.body;
  let candidate, image, imagePath, imageUrl;

  if (req.file) {
    image = req.file.filename;
    imagePath = `candidate-data/images/${image}`;
    imageUrl = `/candidates/assets/images/${image}`;
  }

  try {
    if (!req.file) {
      candidate = await Candidate.findOne({ _id: req.params.id });

      image = candidate.image;
      imagePath = candidate.imagePath;
      imageUrl = candidate.imageUrl;
    }

    await Candidate.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          fullName: fullName,
          politicalParty: politicalParty,
          description: description,
          image: image,
          imagePath: imagePath,
          imageUrl: imageUrl,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).redirect("/api/comissioner/candidates");
  } catch (error) {
    error.code = 404;
    next(error);
    return;
  }
}

async function deleteCandidate(req, res, next) {
  try {
    await Candidate.deleteOne({
      _id: req.params.id,
    });
    res.status(201).json({ message: "Deleted candidate!"})
  } catch (error) {
    error.code = 404;
    next(error);
  }
}

module.exports = {
  getLogin,
  getCandidates,
  getNewCandidate,
  getUpdateCandidate,
  getElections,
  login,
  logout,
  createNewCandidate,
  updateCandidate,
  deleteCandidate
};
