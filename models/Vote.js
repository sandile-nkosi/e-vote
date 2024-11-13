const mongoose = require("mongoose");

const voteSchema = mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Voter",
    },
    vote: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vote", voteSchema);
