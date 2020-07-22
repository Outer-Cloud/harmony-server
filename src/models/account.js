const mongoose = require("mongoose");
const validator = require("validator");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const opts = { toJSON: { virtuals: true } };

const accountSchema = new mongoose.Schema(
  {
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
      unique: true,
    },
  },
  opts
);

accountSchema.index({ userName: 1, discriminator: 1 }, { unique: true });
accountSchema.plugin(mongooseLeanVirtuals);

module.exports = [
  "connection",
  (connection) => {
    return connection.model("Account", accountSchema);
  },
];
