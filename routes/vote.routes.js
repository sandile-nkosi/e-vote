const express = require("express");
const voteController = require("../controllers/vote.controller");
const voteRouter = express.Router();

//get routes
voteRouter.get("/vote", voteController.getVote);
voteRouter.get("/candidate/:id", voteController.getCandidate);

//post rotes
voteRouter.post("/vote/:id", voteController.vote);

module.exports = voteRouter;