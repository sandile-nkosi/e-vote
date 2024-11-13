const express = require("express");
const voteController = require("../controllers/vote.controller");
const voteRouter = express.Router();

//get routes
voteRouter.get("/vote", voteController.getVote);

module.exports = voteRouter;