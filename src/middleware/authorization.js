const jwt = require("jsonwebtoken");

const errors = require("../utils/error/errors");

const loginError = new Error(errors.PLEASE_AUTHENTICATE);
loginError.name = errors.PLEASE_AUTHENTICATE;

module.exports = [
  "loginController",
  "JWT_SECRET",
  (loginController, JWT_SECRET) => {
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

        const { isValid, profile } = await loginController.checkToken(
          decoded._id,
          token
        );

        if (!isValid) {
          throw loginError;
        }

        req.auth = {
          id: decoded._id,
          profile: profile,
          token: token,
        };

        next();
      } catch (error) {
        console.log(error);
        next(error);
      }
    };
  },
];
