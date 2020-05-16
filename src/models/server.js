const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  channelsAndCategories: {
    channel: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "Channel",
        },
      ],
    },
    category: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "Category",
        },
      ],
    },
    validate: (v) => v !== null && v.channel.length + v.category.length < 500,
  },
});

serverSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "servers",
});

module.exports = [
  "connection",
  (connection) => {
    return connection.model("Server", serverSchema);
  },
];
