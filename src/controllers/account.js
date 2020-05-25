const httpStatus = require("../utils/httpStatus");

module.exports = [
  "accountRepository",
  "userController",
  (accountRepository, userController) => {
    const getTokenQuery = (id, token) => {
      return {
        _id: id,
        "tokens.token": token,
      };
    };

    const tokenFilter = {
      tokens: 1,
    };

    return {
      create: async (req, res, next) => {
        try {
          const { userName, ...account } = req.body;

          const profile = await userController.createProfile(userName);
          const newAccount = await accountRepository.create({
            newAccount: {
              ...account,
              profile,
            },
          });
          const token = await accountRepository.generateAuthToken(newAccount);

          res.status(httpStatus.CREATED).json({
            token,
          });
        } catch (error) {
          next(error);
        }
      },

      update: async (req, res, next) => {
        try {
          await accountRepository.update({
            updates: req.body,
            query: { _id: req.auth.id },
          });
          res.send();
        } catch (error) {
          next(error);
        }
      },

      delete: async (req, res, next) => {
        try {
          await accountRepository.delete({ query: { _id: req.auth.id } });
          res.status(httpStatus.NO_CONTENT).send();
        } catch (error) {
          next(error);
        }
      },

      login: async (req, res, next) => {
        try {
          const { email, password } = req.body;
          const account = await accountRepository.findByCredentials(
            email,
            password
          );
          const token = await accountRepository.generateAuthToken(account);

          res.json({
            token,
          });
        } catch (error) {
          next(error);
        }
      },

      logout: async (req, res, next) => {
        try {
          const query = getTokenQuery(req.auth.id, req.auth.token);

          await accountRepository.deleteTokens({ query, tokenFilter });
          res.send();
        } catch (error) {
          next(error);
        }
      },

      logoutAll: async (req, res, next) => {
        try {
          const query = getTokenQuery(req.auth.id, req.auth.token);

          await accountRepository.deleteTokens({
            query,
            tokenFilter,
            removeAll: true,
          });
          res.send();
        } catch (error) {
          next(error);
        }
      },

      checkToken: async (id, token) => {
        const opts = {
          query: getTokenQuery(id, token),
          lean: true,
        };

        const login = await accountRepository.get(opts);

        if (login) {
          return { isValid: true, profile: login.profile };
        }

        return { isValid: false };
      },
    };
  },
];
