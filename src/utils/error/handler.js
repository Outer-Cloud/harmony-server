const errors = require("./errors");
const httpStatus = require("../httpStatus");
const repoError = require("./repoError");

module.exports = (err, req, res, next) => {
  let statusMessage;
  let status;
  let message;
  let retval = { status, message };

  console.log(err);

  const repoErr = repoError.getRepoError(err);

  if (repoErr) {
    retval = repoErr;
    statusMessage = httpStatus.getStatusText(httpStatus.BAD_REQUEST);
  } else {
    const { status, message } = errors.getErrorInfo(err.name || err.message);
    statusMessage = httpStatus.getStatusText(status);
    retval.status = status;
    retval.message = message;
  }
  res.status(retval.status).send({
    error: statusMessage,
    message: retval.message,
    status: retval.status,
  });
};
