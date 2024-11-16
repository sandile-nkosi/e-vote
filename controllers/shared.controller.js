const Candidate = require("../models/Candidate");
const Vote = require("../models/Vote");

async function getIndex(req, res, next) {
  try {
    const candidates = await Candidate.find({});
    const votes = await Vote.find({});
    const votesTotal = await Vote.estimatedDocumentCount();






    res.render("shared/index", { candidates, votes, votesTotal });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getIndex,
};
