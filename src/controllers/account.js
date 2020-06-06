const httpStatus = require("../utils/httpStatus");

module.exports = [
  "accountRepository",
  "profileRepository",
  "relationshipsRepository",
  "groupsRepository",
  (
    accountRepository,
    profileRepository,
    relationshipsRepository,
    groupsRepository
  ) => {
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
          const newAccount = await accountRepository.create({
            newAccount: {
              ...req.body,
            },
          });
          await relationshipsRepository.create(newAccount._id);
          await groupsRepository.create(newAccount._id);
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
          await profileRepository.delete({ query: { account: req.auth.id } });
          await relationshipsRepository.delete({
            query: { account: req.auth.id },
          });
          await groupsRepository.delete({ query: { account: req.auth.id } });
          res.send();
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

          await accountRepository.deleteTokens({ query, filter: tokenFilter });
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
            filter: tokenFilter,
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
          return true;
        }

        return false;
      },
    };
  },
];
