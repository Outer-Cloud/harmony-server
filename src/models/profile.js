const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const opts = { toJSON: { virtuals: true } };

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
      immutable: true,
      validate: (v) => +new Date().getFullYear() - +v.getFullYear() >= 13,
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
  },
  opts
);

profileSchema.virtual("age").get(function () {
  return +new Date().getFullYear() - +this.birthDate.getFullYear();
});
profileSchema.plugin(mongooseLeanVirtuals);

module.exports = [
  "connection",
  (connection) => {
    return connection.model("Profile", profileSchema);
  },
];
