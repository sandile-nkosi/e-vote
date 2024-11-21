const mongoose = require("mongoose");
const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

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
    province: {
      type: String,
      enum: provinces,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vote", voteSchema);
