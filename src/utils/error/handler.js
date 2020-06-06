const errors = require("./errors");
const httpStatus = require("../httpStatus");

module.exports = (err, req, res, next) => {

  const statusMessage;
  const  retval =   { status, message };


  if (err.name === "MongoError") {
      retval.status = httpStatus.BAD_REQUEST;
      retval.message = err.message;
      statusMessage = httpStatus.getStatusText(httpStatus.BAD_REQUEST);
  } else {
    retval = errors.getErrorInfo(err.name || err.message);
    statusMessage = httpStatus.getStatusText(status);
  }
  res.status(retval.status).send({
    error: retval.message,
    message: statusMessage,
    status: retval.status
  });
};
