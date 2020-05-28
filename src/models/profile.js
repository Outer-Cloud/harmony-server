const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
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
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

profileSchema.methods.toJSON = function () {
  const profile = this;
  const profileObject = profile.toObject();

  delete profileObject._id;
  delete profileObject.__v;

  return profileObject;
};

module.exports = [
  "connection",
  (connection) => {
    return connection.model("Profile", profileSchema);
  },
];
