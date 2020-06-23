module.exports = [
  "httpStatus",
  (httpStatus) => {
    const codes = httpStatus.statusCodes;

    const errorInfo = {};
    const errorCodes = {};

    errorInfo[(errorCodes.UNKNOWN = "UnknownError")] = {
      status: codes.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
    };
    errorInfo[(errorCodes.LOGIN_FAILED = "LoginFailedError")] = {
      status: codes.UNAUTHORIZED,
      message: "Unable to login",
    };
    errorInfo[(errorCodes.PLEASE_AUTHENTICATE = "PleaseAuthenticateError")] = {
      status: codes.UNAUTHORIZED,
      message: "Please log in",
    };
    errorInfo[(errorCodes.INVALID_UPDATES = "InvalidUpdatesError")] = {
      status: codes.BAD_REQUEST,
      message: "The update contains invalid fields",
    };
    errorInfo[(errorCodes.MISSING_PASSWORD = "MISSING_PASSWORD")] = {
      status: codes.BAD_REQUEST,
      message: "Missing password",
    };
    errorInfo[(errorCodes.INVALID_PASSWORD = "INVALID_PASSWORD")] = {
      status: codes.BAD_REQUEST,
      message: "Invalid password",
    };
    errorInfo[(errorCodes.MISSING_EMAIL = "MISSING_EMAIL")] = {
      status: codes.BAD_REQUEST,
      message: "Missing email",
    };
    errorInfo[(errorCodes.INVALID_OBJECT = "InvalidObjectError")] = {
      status: codes.BAD_REQUEST,
      message: "The object contains invalid fields",
    };

    errorInfo[(errorCodes.TOKEN_EXPIRE = "TokenExpiredError")] = {
      status: codes.UNAUTHORIZED,
      message: "Token expire. Please log in again",
    };

    errorInfo[(errorCodes.USER_DOES_NOT_EXIST = "UserDoesNotExistError")] = {
      status: codes.NOT_FOUND,
      message: "The user does not exists. Please try again",
    };

    errorInfo[(errorCodes.MESSAGE_NOT_EXIST = "MessageIDNotExistError")] = {
      status: codes.NOT_FOUND,
      message: "Error: message with corresponding ID does not exist",
    };

    errorInfo[(errorCodes.MESSAGE_NO_TEXT = "MessageNotContainText")] = {
      status: codes.BAD_REQUEST,
      message: "Error: text in message body contains an empty string",
    };

    errorInfo[
      (errorCodes.MESSAGE_AUTHOR_ID_MISMATCH = "MessageAuthorIdMismatch")
    ] = {
      status: codes.FORBIDDEN,
      message: "Error: Attempt to change/delete message you did not write",
    };

    errorInfo[
      (errorCodes.CHANNEL_NOT_EXIST = "ChannelIDNotExistError")
    ] = {
      status: codes.NOT_FOUND,
      message: "Error: channel with corresponding ID does not exist",
    };

    return {
      errorCodes,
      getErrorInfo: (error) => {
        if (errorInfo.hasOwnProperty(error)) {
          return errorInfo[error];
        } else {
          return errorInfo[errorCodes.UNKNOWN];
        }
      },
    };
  },
];
