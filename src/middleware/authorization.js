const jwt = require("jsonwebtoken");

const errors = require("../utils/error/errors");

const loginError = new Error(errors.PLEASE_AUTHENTICATE);
loginError.name = errors.PLEASE_AUTHENTICATE;

module.exports = [
  "accountController",
  "JWT_SECRET",
  (accountController, JWT_SECRET) => {
    const safeParse = (req) => {
      try {
        return req.header("Authorization").replace("Bearer ", "");
      } catch {
        throw loginError;
      }
    };

    return async (req, res, next) => {
      try {
        const token = safeParse(req);
        const decoded = jwt.verify(token, JWT_SECRET);

        const  isValid = await accountController.checkToken(
          decoded._id,
          token
        );

        if (!isValid) {
          throw loginError;
        }

        req.auth = {
          id: decoded._id,
          token: token,
        };

        next();
      } catch (error) {
        next(error);
      }
    };
  },
];
