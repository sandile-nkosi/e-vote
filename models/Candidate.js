const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    politicalParty: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    nationalVotes: {
      type: Number,
      default: 0,
    },
    provincialVotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);
