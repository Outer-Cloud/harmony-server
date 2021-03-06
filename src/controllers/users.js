module.exports = [
  "bcrypt",
  "accountRepository",
  "profileRepository",
  "relationshipsRepository",
  "groupsRepository",
  "httpStatus",
  "errors",
  "utils",
  "values",
  (
    bcrypt,
    accountRepository,
    profileRepository,
    relationshipsRepository,
    groupsRepository,
    httpStatus,
    errors,
    utils,
    values
  ) => {
    const codes = httpStatus.statusCodes;
    const errorCodes = errors.errorCodes;
    const { isValid, invalid, isValidPassword, generateToken } = utils;
    const constants = values.constants;

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
            _id: account.profile,
          };

          const profileProjection = {
            _id: 0,
            age: 0,
            name: 0,
            birthDate: 0,
          };

          const profiletOpts = {
            query: profileQuery,
            projection: profileProjection,
            lean: true,
          };

          const profile = await profileRepository.get(profiletOpts);

          const id = account._id;

          delete account._id;
          delete account.profile;
          delete account.relationships;

          const returnVal = {
            id,
            account,
            profile,
          };

          res.json(returnVal);
        } catch (error) {
          next(error);
        }
      },
      create: async (req, res, next) => {
        let newRelationships;
        let newProfile;

        try {
          const isProfileValid = isValid(
            req.body.profile,
            profileRepository.getSchema(),
            invalid.profile
          );

          const isAccountValid = isValid(
            req.body.account,
            accountRepository.getSchema(),
            invalid.account
          );

          if (!(isProfileValid && isAccountValid)) {
            const error = new Error(errorCodes.INVALID_OBJECT);
            error.name = errorCodes.INVALID_OBJECT;
            throw error;
          }

          const password = req.body.account.password;

          if (!password || !isValidPassword(password)) {
            const error = new Error(errorCodes.INVALID_PASSWORD);
            error.name = errorCodes.INVALID_PASSWORD;
            throw error;
          }

          const account = { ...req.body.account };
          const profile = { ...req.body.profile };

          account.password = await bcrypt.hash(account.password, 8);

          newProfile = await profileRepository.create({
            ...profile,
            language: profile.language || constants.EN,
            status: constants.STATUS_ONLINE,
          });

          newRelationships = await relationshipsRepository.create();

          const newAccount = await accountRepository.create({
            ...account,
            profile: newProfile._id,
            relationships: newRelationships._id,
          });

          const id = newAccount._id;

          await groupsRepository.create(id);

          const token = await generateToken(id);

          await accountRepository.insertToken(id, token);

          const retVal = {
            token,
            id,
            account: newAccount.toJSON(),
            profile: newProfile.toJSON(),
          };

          delete retVal.account._id;
          delete retVal.account.__v;
          delete retVal.account.id;
          delete retVal.account.profile;
          delete retVal.account.relationships;
          delete retVal.account.tokens;
          delete retVal.account.password;

          delete retVal.profile._id;
          delete retVal.profile.__v;
          delete retVal.profile.id;

          res.status(codes.CREATED).json(retVal);
        } catch (error) {
          if (newProfile) {
            await profileRepository.delete(newProfile._id);
          }
          if (newRelationships) {
            await relationshipsRepository.delete(newRelationships._id);
          }

          next(error);
        }
      },
    };
  },
];
