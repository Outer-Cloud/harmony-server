const errors = require("./errors");
const httpStatus = require("../httpStatus");

module.exports = (err, req, res, next) => {
  const { status, message } = errors.getErrorInfo(err.name || err.message);

  const statusMessage;

  if (status === "MongoError") {
    if (err.code == 11000) {
      status = httpStatus.BAD_REQUEST;
      statusMessage = httpStatus.getStatusText(status);
    }

  } else {
    statusMessage = httpStatus.getStatusText(status);
  }

  res.status(status).send({
    error: message,
    message: statusMessage,
    status,
  });
};
