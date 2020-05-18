const httpStatus = require("../httpStatus");

const errorInfo = {};

errorInfo[(exports.UNKNOWN = "UnknownError")] = {
  status: httpStatus.INTERNAL_SERVER_ERROR,
  message: "Something went wrong!",
};
errorInfo[(exports.LOGIN_FAILED = "LoginFailedError")] = {
  status: httpStatus.UNAUTHORIZED,
  message: "Unable to login",
};
errorInfo[(exports.PLEASE_AUTHENTICATE = "PleaseAuthenticateError")] = {
  status: httpStatus.UNAUTHORIZED,
  message: "Please log in",
};
errorInfo[(exports.INVALID_UPDATES = "InvalidUpdatesError")] = {
  status: httpStatus.BAD_REQUEST,
  message: "The update contains invalid fields",
};
errorInfo[(exports.INVALID_OBJECT = "InvalidObjectError")] = {
  status: httpStatus.BAD_REQUEST,
  message: "The object contains invalid fields",
};

errorInfo[(exports.TOKEN_EXPIRE = "TokenExpiredError")] = {
  status: httpStatus.UNAUTHORIZED,
  message: "Token expire. Please log in again"
};

errorInfo[(exports.MESSAGE_NOT_EXIST = "MessageIDNotExistError")] = {
  status: httpStatus.NOT_FOUND,
  message: "Error: message with corresponding ID does not exist"
};

exports.getErrorInfo = (error) => {
  if (errorInfo.hasOwnProperty(error)) {
    return errorInfo[error];
  } else {
    return errorInfo[this.UNKNOWN];
  }
};