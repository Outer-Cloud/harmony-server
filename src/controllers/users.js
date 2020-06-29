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

    return {
      get: async (req, res, next) => {
        try {
          const accountQuery = {
            _id: req.params.id,
          };

          const accounProjection = {
            tokens: 0,
            password: 0,
          };

          const accountOpts = {
            query: accountQuery,
            projection: accounProjection,
            lean: true,
          };

          const account = await accountRepository.get(accountOpts);

          

          if (!account) {
            const error = new Error(errorCodes.USER_DOES_NOT_EXIST);
            error.name = errorCodes.USER_DOES_NOT_EXIST;
            throw error;
          }

          const profileQuery = {
            account: req.params.id,
          };

          const profileProjection = {
            _id: 0,
            __v: 0,
            age: 0,
            name: 0,
          };

          const profiletOpts = {
            query: profileQuery,
            projection: profileProjection,
            lean: true,
          };

          const profile = (await profileRepository.get(profiletOpts)) || {};

          const id = account._id;

          delete account._id;

          const returnVal = {
            id,
            account,
            profile,
          };

          console.log(returnVal)

          res.json(returnVal || {});
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
    };
  },
];
