const mongoose = require("mongoose");

const groupsSchema = new mongoose.Schema({
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
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

groupsSchema.methods.toJSON = function () {
  const groups = this;
  const groupsObject = groups.toObject();

  delete groupsObject._id;
  delete groupsObject.__v;

  return groupsObject;
};

module.exports = [
  "connection",
  (connection) => {
    return connection.model("Groups", groupsSchema);
  },
];
