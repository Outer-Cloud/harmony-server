module.exports = [
  "bcrypt",
  "accountRepository",
  "profileRepository",
  "relationshipsRepository",
  "groupsRepository",
  "httpStatus",
  "errors",
  "utils",
  (
    bcrypt,
    accountRepository,
    profileRepository,
    relationshipsRepository,
    groupsRepository,
    httpStatus,
    errors,
    utils
  ) => {
    const codes = httpStatus.statusCodes;
    const errorCodes = errors.errorCodes;
    const { isValid, invalid, isValidPassword, generateToken } = utils;

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
      get: async (req, res, next) => {
        try {
          const query = {
            _id: req.auth.id,
          };

          const projection = {
            tokens: 0,
            password: 0,
            _id: 0,
            __v: 0,
          };

          const opts = {
            query,
            projection,
            lean: true,
          };

          const result = await accountRepository.get(opts);

          res.json(result || {});
        } catch (error) {
          next(error);
        }
      },
      create: async (req, res, next) => {
        try {
          if (!req.body.password || !isValidPassword(req.body.password)) {
            const error = new Error(errorCodes.INVALID_PASSWORD);
            error.name = errorCodes.INVALID_PASSWORD;
            throw error;
          }

          if (
            !isValid(req.body, accountRepository.getSchema(), invalid.account)
          ) {
            const error = new Error(errorCodes.INVALID_OBJECT);
            error.name = errorCodes.INVALID_OBJECT;
            throw error;
          }
          req.body.password = await bcrypt.hash(req.body.password, 8);
          const newId = await accountRepository.create({
            newAccount: {
              ...req.body,
            },
          });

          await relationshipsRepository.create(newId);
          await groupsRepository.create(newId);

          const token = await generateToken(newId);

          await accountRepository.insertToken(newId, token);

          res.status(codes.CREATED).json({
            token,
          });
        } catch (error) {
          next(error);
        }
      },

      update: async (req, res, next) => {
        try {
          if (
            !isValid(req.body, accountRepository.getSchema(), invalid.account)
          ) {
            const error = new Error(errorCodes.INVALID_UPDATES);
            error.name = errorCodes.INVALID_UPDATES;
            throw error;
          }

          if (req.body.password) {
            if (!isValidPassword(req.body.password)) {
              const error = new Error(errorCodes.INVALID_PASSWORD);
              error.name = errorCodes.INVALID_PASSWORD;
              throw error;
            }

            req.body.password = await bcrypt.hash(req.body.password, 8);
          }

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
