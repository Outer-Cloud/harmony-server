const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  server: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Server",
  },
});

module.exports = [
  "connection",
  "base",
  (connection) => {
    return connection.model("Category", categorySchema);
  },
];
