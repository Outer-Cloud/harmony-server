const mongoose = require("mongoose");
const validator = require("validator");

const accountSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: false,
  },
  discriminator: {
    type: String,
    required: true,
    unique: false,
  },
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
});

accountSchema.index({ userName: 1, discriminator: 1 }, { unique: true });

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
