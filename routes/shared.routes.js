const express = require("express");
const sharedController = require("../controllers/shared.controller");
const sharedRouter = express.Router();

//get routes
sharedRouter.get("/", sharedController.getIndex);


module.exports = sharedRouter;

