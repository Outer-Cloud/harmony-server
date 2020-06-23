const mongoose = require("mongoose");

module.exports = [
  "connection",
  "channelTypes",
  (connection, channelTypes) => {
    const channelSchema = new mongoose.Schema({
      name: {
        type: String,
        ref: "name",
        required: true,
      },

      topic: {
        type: String,
        ref: "topic",
        required: () => {
          return (
            this.type === channelTypes.GROUP_DM || this.type === channelTypes.DM
          );
        },
      },

      type: {
        type: Number,
        ref: "type",
        requird: true,
      },

      users: {
        type: [
          {
            type: mongoose.Schema.ObjectId,
            ref: "users",
            required: true,
          },
        ],
        required: () => {
          return this.type === channelTypes.GROUP_DM;
        },
      },

      owner: {
        type: mongoose.Schema.ObjectId,
        ref: "DMOwner",
        required: () => {
          return this.type === channelTypes.GROUP_DM;
        },
      },

      icon: {},
    });
    return connection.model("Channel", channelSchema);
  },
];
