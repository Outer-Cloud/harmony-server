const httpstatus = require("../httpStatus");

exports.getRepoError = (err) => {
  if (err.name === "MongoError" && err.code === 11000) {
    return {
      status: httpstatus.BAD_REQUEST,
      message: err.message,
    };
  }

  if (err.name === "ValidationError") {
    return {
      status: httpstatus.BAD_REQUEST,
      message: err.message,
    };
  }
  return null;
};
