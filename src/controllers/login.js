const httpStatus = require("../utils/httpStatus");

module.exports = [
  "loginRepository",
  "userController",
  (loginRepository, userController) => {
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
          const profile = await userController.createProfile();
          const newLogin = await loginRepository.create({
            newLogin: {
              ...req.body,
              profile,
            },
          });
          const token = await loginRepository.generateAuthToken(newLogin);

          res.status(httpStatus.CREATED).json({
            token,
          });
        } catch (error) {
          next(error);
        }
      },

      update: async (req, res, next) => {
        try {
          await loginRepository.update({
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
          await loginRepository.delete({ query: { _id: req.auth.id } });
          res.status(httpStatus.NO_CONTENT).send();
        } catch (error) {
          next(error);
        }
      },

      login: async (req, res, next) => {
        try {
          const { userName, email, password } = req.body;
          const login = await loginRepository.findByCredentials(
            email,
            userName,
            password
          );
          const token = await loginRepository.generateAuthToken(login);

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

          await loginRepository.deleteTokens({ query, tokenFilter });
          res.send();
        } catch (error) {
          next(error);
        }
      },

      logoutAll: async (req, res, next) => {
        try {
          const query = getTokenQuery(req.auth.id, req.auth.token);

          await loginRepository.deleteTokens({
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

        const login = await loginRepository.get(opts);

        if (login) {
          return { isValid: true, profile: login.profile };
        }

        return { isValid: false };
      },
    };
  },
];
