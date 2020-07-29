module.exports = [
  "_",
  "bcrypt",
  "accountRepository",
  "profileRepository",
  "relationshipsRepository",
  "groupsRepository",
  "httpStatus",
  "errors",
  "utils",
  (
    _,
    bcrypt,
    accountRepository,
    profileRepository,
    relationshipsRepository,
    groupsRepository,
    errors,
    utils
  ) => {
    const errorCodes = errors.errorCodes;
    const { isValid, invalid, isValidPassword } = utils;

    return {
      get: async (req, res, next) => {
        try {
          res.json(req.users.me || {});
        } catch (error) {
          next(error);
        }
      },

      update: async (req, res, next) => {
        try {
          const { newPassword = "", password = "", ...body } = req.body;

          if (!isValid(body, accountRepository.getSchema(), invalid.account)) {
            const error = new Error(errorCodes.INVALID_UPDATES);
            error.name = errorCodes.INVALID_UPDATES;
            throw error;
          }

          const curr = await accountRepository.get({
            query: {
              _id: req.auth.id,
            },
            projection: {
              tokens: 0,
              _id: 0,
              discriminator: 0,
            },
            lean: true,
          });

          const currPassword = curr.password;
          delete curr.password;

          const unchanged = _.isEqual(body, curr);
          const empty = _.isEmpty(body);

          if ((unchanged || empty) && !newPassword) {
            return res.send();
          }

          const match = await bcrypt.compare(password, currPassword);

          const updates = { ...body };

          if (!match) {
            const error = new Error(errorCodes.PASSWORD_MISMATCH);
            error.name = errorCodes.PASSWORD_MISMATCH;
            throw error;
          }

          if (newPassword) {
            if (!isValidPassword(newPassword)) {
              const error = new Error(errorCodes.INVALID_PASSWORD);
              error.name = errorCodes.INVALID_PASSWORD;
              throw error;
            }

            updates.password = await bcrypt.hash(newPassword, 8);
          }

          await accountRepository.update({
            updates,
            query: { _id: req.auth.id },
          });
          res.send();
        } catch (error) {
          next(error);
        }
      },

      delete: async (req, res, next) => {
        try {
          const deleted = await accountRepository.delete({
            query: { _id: req.auth.id },
          });
          await profileRepository.delete(deleted.profile);
          await relationshipsRepository.delete(deleted.relationships);
          await groupsRepository.delete({ query: { account: req.auth.id } });
          res.send();
        } catch (error) {
          next(error);
        }
      },
    };
  },
];
