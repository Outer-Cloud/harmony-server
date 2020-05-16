const mongoose = require("mongoose");

module.exports = [
  "dbUrl",
  (dbUrl) => {
    return mongoose.createConnection(dbUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  },
];
