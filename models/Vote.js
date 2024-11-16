const mongoose = require("mongoose");

const voteSchema = mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Voter",
    },
    nationalVote: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Candidate",
    },
    provincialVote: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Candidate",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vote", voteSchema);
