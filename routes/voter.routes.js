const express = require("express");
const voterController = require("../controllers/voter.controller");
const voterRouter = express.Router();

//get routes
voterRouter.get("/login", voterController.getLogin);

voterRouter.get("/register", voterController.getRegister);

// post routes
voterRouter.post("/login", voterController.login);

voterRouter.post("/logout", voterController.logout);

voterRouter.post("/register", voterController.register);


module.exports = voterRouter;
