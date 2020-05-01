const httpStatus = require('../utils/httpStatus');

const errors = {};

errors[exports.UNKNOWN = 'Something went wrong!'] = httpStatus.INTERNAL_SERVER_ERROR;
errors[exports.LOGIN_FAILED = 'Unable to login'] = httpStatus.UNAUTHORIZED;
errors[exports.PLEASE_AUTHENTICATE = 'Please authenticate'] = httpStatus.UNAUTHORIZED; 
errors[exports.INVALID_UPDATES = 'Invalid updates'] = httpStatus.BAD_REQUEST;
errors[exports.INVALID_OBJECT = 'Invalid object'] = httpStatus.BAD_REQUEST;

module.getErrorStatusCode = (error) => {
    if (errors.hasOwnProperty(error)) {
        return errors[error];
      } else {
        throw new Error(`Error does not exist: ${error}`);
      }
};