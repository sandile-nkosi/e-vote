const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");
const Vote = require("../models/Vote");
const mongoose = require("mongoose");

async function getVote(req, res, next) {
  try {
    const voter = await Voter.findById(res.locals.uid).exec();
    const candidates = await Candidate.find({});
    if (!voter) {
      res.redirect("/api/voter/login");
    } else {
      res.render("voter/vote", { candidates, voter });
    }
  } catch (error) {
    next(error);
  }
}

async function getCandidate(req, res, next) {
  try {
    const candidate = await Candidate.findById(req.params.id).exec();

    res.render("voter/candidate-details", { candidate })
  } catch (error) {
    next(error);
  }
}

async function vote(req, res, next) {
  const voterId = mongoose.Types.ObjectId.createFromHexString(res.locals.uid);
  const nationalVote = mongoose.Types.ObjectId.createFromHexString(
    req.params.id
  );
  const provincialVote = mongoose.Types.ObjectId.createFromHexString(
    req.params.id
  );
  const voteType = req.body.voteType;

  if (!res.locals.isAuth) {
    console.log("Please login to Vote!");
    return res.status(401).redirect("/voter/vote");
  }

  if (!voteType) {
    console.log("Select vote type!");
    return res.redirect("/voter/vote");
  }

  //update logged in voters vote

  try {
    const voter = await Voter.findById(voterId).exec();

    if (voteType === "nationalVote") {
      await Vote.updateOne({ voter: voterId }, { nationalVote: nationalVote });

      await Voter.updateOne({ _id: voterId }, { hasVotedNationally: true });

      return res.status(201).redirect("/voter/vote");
    } else if (voteType === "provincialVote") {
      await Vote.updateOne(
        { voter: voterId },
        { provincialVote: provincialVote }
      );

      await Voter.updateOne({ _id: voterId }, { hasVotedprovincially: true });

      return res.status(201).redirect("/voter/vote");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getVote,
  getCandidate,
  vote,
};
