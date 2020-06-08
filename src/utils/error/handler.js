const errors = require("./errors");
const httpStatus = require("../httpStatus");
const repoError = require("./repoError");

module.exports = (err, req, res, next) => {
  let statusMessage;
  let retval = {};

  console.log(err);

  const repoErr = repoError.getRepoError(err);

  if (repoErr) {
    retval = repoErr;
    statusMessage = httpStatus.getStatusText(retval.status);
  } else {
    retval = errors.getErrorInfo(err.name || err.message);
    statusMessage = httpStatus.getStatusText(retval.status);
  }
  res.status(retval.status).send({
    error: statusMessage,
    message: retval.message,
    status: retval.status,
  });
};
