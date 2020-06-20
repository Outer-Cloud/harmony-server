const mongoose = require("mongoose");

const relationshipsSchema = new mongoose.Schema({
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

relationshipsSchema.methods.toJSON = function () {
  const relationships = this;
  const relationshipsObject = relationships.toObject();

  delete relationshipsObject._id;
  delete relationshipsObject.__v;

  return relationshipsObject;
};

module.exports = [
  "connection",
  (connection) => {
    return connection.model("Relationships", relationshipsSchema);
  },
];
