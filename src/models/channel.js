const mongoose = require("mongoose");

module.exports = [
  "connection",
  "values",
  (connection, values) => {
    const { DM, GROUP_DM, SERVER_TEXT, SERVER_NEWS, SERVER_VOICE } = values.constants
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
            this.type === GROUP_DM || this.type === DM
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
          return this.type === GROUP_DM;
        },
      },

      owner: {
        type: mongoose.Schema.ObjectId,
        ref: "DMOwner",
        required: () => {
          return this.type === GROUP_DM;
        },
      },

      server: {
        type: mongoose.Schema.ObjectId,
        ref: "Server",
        required: () => {
          return (
            this.type === SERVER_TEXT ||
            this.type === SERVER_NEWS ||
            this.type === SERVER_VOICE
          );
        },
      },

      icon: {},
    });
    return connection.model("Channel", channelSchema);
  },
];
