const errors = require("./errors");
const httpStatus = require("../httpStatus");

module.exports = (err, req, res, next) => {
  let statusMessage;
  let status;
  let message;
  let retval = { status, message };

  if (err.name === "MongoError") {
    retval.status = httpStatus.BAD_REQUEST;
    retval.message = err.message;
    statusMessage = httpStatus.getStatusText(httpStatus.BAD_REQUEST);
  } else {
    const { status, message } = errors.getErrorInfo(err.name || err.message);
    statusMessage = httpStatus.getStatusText(status);
    retval.status = status;
    retval.message = message;
  }
  res.status(retval.status).send({
    error: retval.message,
    message: statusMessage,
    status: retval.status,
  });
};
