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
errorInfo[(exports.MISSING_PASSWORD = "MISSING_PASSWORD")] = {
  status: httpStatus.BAD_REQUEST,
  message: "Missing password",
};
errorInfo[(exports.MISSING_EMAIL = "MISSING_EMAIL")] = {
  status: httpStatus.BAD_REQUEST,
  message: "Missing email",
};
errorInfo[(exports.INVALID_OBJECT = "InvalidObjectError")] = {
  status: httpStatus.BAD_REQUEST,
  message: "The object contains invalid fields",
};

errorInfo[(exports.TOKEN_EXPIRE = "TokenExpiredError")] = {
  status: httpStatus.UNAUTHORIZED,
  message: "Token expire. Please log in again",
};

errorInfo[(exports.USER_DOES_NOT_EXIST = "UserDoesNotExistError")] = {
  status: httpStatus.NOT_FOUND,
  message: "The user does not exists. Please try gain",
};

errorInfo[(exports.MESSAGE_NOT_EXIST = "MessageIDNotExistError")] = {
  status: httpStatus.NOT_FOUND,
  message: "Error: message with corresponding ID does not exist",
};

errorInfo[(exports.MESSAGE_NO_TEXT = "MessageNotContainText")] = {
  status: httpStatus.BAD_REQUEST,
  message: "Error: text in message body contains an empty string",
};

exports.getErrorInfo = (error) => {
  if (errorInfo.hasOwnProperty(error)) {
    return errorInfo[error];
  } else {
    return errorInfo[this.UNKNOWN];
  }
};
