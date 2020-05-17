const mongoose = require("mongoose");

const options = {
  discriminatorKey: "type",
};

const roomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  options
);

roomSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "",
});

module.exports = [
  "connection",
  (connection) => {
    return connection.model("Room", roomSchema);
  },
];
