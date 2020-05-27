const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: [7, "Too young"],
  },
  status: {
    type: String,
    required: true,
    trim: true,
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  statusMessage: {
    type: String,
    trim: true,
  },
  servers: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Server",
      },
    ],
    validate: (v) => v !== null && v.length < 100,
  },
  directMessages: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "DirectMessage",
    },
  ],
  friends: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    validate: (v) => v !== null && v.length < 1000,
  },
  blocked: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    validate: (v) => v !== null && v.length < 1000,
  },
  pending: {
    type: [
      {
        id: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "User",
        },
        type: {
          type: String,
          required: true,
        },
      },
    ],
    validate: (v) => v !== null && v.length < 1000,
  },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject._id;
  delete userObject.__v;

  return userObject;
};

module.exports = [
  "connection",
  (connection) => {
    return connection.model("User", userSchema);
  },
];
