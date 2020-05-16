const mongoose = require("mongoose");

const dmSchema = new mongoose.Schema({
  users: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    validate: (v) => v !== null && v.length < 15,
  },
  icon: {
    type: Buffer,
  },
});

module.exports = [
  "connection",
  "base",
  (connection, base) => {
    const schema = base.discriminator("", dmSchema);
    return connection.model("DM", schema);
  },
];
