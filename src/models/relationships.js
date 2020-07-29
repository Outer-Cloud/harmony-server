const mongoose = require("mongoose");

const pendingSubSchema = new mongoose.Schema(
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
  { _id: false }
);

const relationshipsSchema = new mongoose.Schema({
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
    type: [pendingSubSchema],
    validate: (v) => v !== null && v.length < 1000,
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
