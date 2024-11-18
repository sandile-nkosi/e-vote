const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");
const Vote = require("../models/Vote");
const mongoose = require("mongoose");
const pusher = require("../config/pusher");

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

    res.render("voter/candidate-details", { candidate });
  } catch (error) {
    next(error);
  }
}

async function vote(req, res, next) {
  const voterId = mongoose.Types.ObjectId.createFromHexString(res.locals.uid);
  const nationalVote = mongoose.Types.ObjectId.createFromHexString(req.params.id);
  const provincialVote = mongoose.Types.ObjectId.createFromHexString(req.params.id);
  const voteType = req.body.voteType;

  if (!res.locals.isAuth) {
    console.log("Please login to Vote!");
    return res.status(401).redirect("/voter/vote");
  }

  if (!voteType) {
    console.log("Select vote type!");
    return res.redirect("/voter/vote");
  }

  try {
    const voter = await Voter.findById(voterId).exec();
    const existingVote = await Vote.findOne({ voter: voterId }).exec();

    if (!existingVote) {
      await Vote.create({ voter: voter._id });
    }

    if (voteType === "nationalVote") {
      await Vote.updateOne({ voter: voterId }, { nationalVote: nationalVote });
      await Candidate.findByIdAndUpdate(nationalVote, { $inc: { nationalVotes: 1 } }, { new: true });
      await Voter.updateOne({ _id: voterId }, { hasVotedNationally: true });
    } else if (voteType === "provincialVote") {
      await Vote.updateOne({ voter: voterId }, { provincialVote: provincialVote });
      await Candidate.findByIdAndUpdate(provincialVote, { $inc: { provincialVotes: 1 } }, { new: true });
      await Voter.updateOne({ _id: voterId }, { hasVotedprovincially: true });
    }

    const votesTotal = await Vote.estimatedDocumentCount();
    const candidates = await Candidate.find({});

    // Send a Pusher event for each candidate with updated vote counts
    for (const candidate of candidates) {
      pusher.trigger("e-vote", "votes", {
        votesTotal,
        candidateId: candidate._id, // Unique ID for each candidate
        nationalVotes: candidate.nationalVotes,
        provincialVotes: candidate.provincialVotes
      });
    }

    res.status(201).redirect("/voter/vote");
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getVote,
  getCandidate,
  vote,
};
