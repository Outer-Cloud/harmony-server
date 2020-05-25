const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowerCase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],

  profile: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});

accountSchema.methods.toJSON = function () {
  const account = this;
  const accountObject = account.toObject();

  delete accountObject._id;

  return accountObject;
};

module.exports = [
  "connection",
  (connection) => {
    return connection.model("Account", accountSchema);
  },
];
