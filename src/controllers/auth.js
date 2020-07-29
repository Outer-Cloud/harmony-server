module.exports = [
  "bcrypt",
  "accountRepository",
  "errors",
  "utils",
  (bcrypt, accountRepository, errors, utils) => {
    const errorCodes = errors.errorCodes;
    const { generateToken } = utils;

    return {
      login: async (req, res, next) => {
        try {
          const { email, password } = req.body;

          if (!email) {
            const error = new Error(errorCodes.MISSING_EMAIL);
            error.name = errorCodes.MISSING_EMAIL;
            throw error;
          }

          if (!password) {
            const error = new Error(errorCodes.MISSING_PASSWORD);
            error.name = errorCodes.MISSING_PASSWORD;
            throw error;
          }

          const account = await accountRepository.findByEmail(email);

          if (!account || !(await bcrypt.compare(password, account.password))) {
            const error = new Error(errorCodes.LOGIN_FAILED);
            error.name = errorCodes.LOGIN_FAILED;
            throw error;
          }

          const token = await generateToken(account._id.toString());
          await accountRepository.insertToken(account._id, token);

          res.json({
            token,
          });
        } catch (error) {
          next(error);
        }
      },

      logout: async (req, res, next) => {
        try {
          await accountRepository.deleteTokens(req.auth.id, req.params.token);
          res.send();
        } catch (error) {
          next(error);
        }
      },

      checkToken: (id, token) => {
        return accountRepository.exists({
          _id: id,
          "tokens.token": token,
        });
      },
    };
  },
];
