module.exports = [
  "repoError",
  "httpStatus",
  "errors",
  (repoError, httpStatus, errors) => (err, req, res, next) => {
    let statusMessage;
    let retval = {};

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
  },
];
