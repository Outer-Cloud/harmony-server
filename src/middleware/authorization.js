module.exports = [
  "jsonwebtoken",
  "accountController",
  "errors",
  "JWT_SECRET",
  (jsonwebtoken, accountController, errors, JWT_SECRET) => {
    const errorCodes = errors.errorCodes;

    const loginError = new Error(errorCodes.PLEASE_AUTHENTICATE);
    loginError.name = errorCodes.PLEASE_AUTHENTICATE;

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
        const decoded = jsonwebtoken.verify(token, JWT_SECRET);

        const isValid = await accountController.checkToken(decoded._id, token);

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
