const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const comissionerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      set: (value) => value.toLowerCase(),
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//login - valid password match
comissionerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Comissioner", comissionerSchema);
