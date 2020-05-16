const errors = require("./errors");
const httpStatus = require("../httpStatus");

module.exports = (err, req, res, next) => {
  
  const { status, message } = errors.getErrorInfo(
    err.name || err.message
  );


  const statusMessage = httpStatus.getStatusText(status);

  res.status(status).send({
    error: message,
    message: statusMessage,
    status
  });
};
