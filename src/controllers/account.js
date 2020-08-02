module.exports = [
  "_",
  "bcrypt",
  "accountRepository",
  "profileRepository",
  "relationshipsRepository",
  "groupsRepository",
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
      get: async (req, res) => {
        delete req.users.me.tokens;
        delete req.users.me.password;
        delete req.users.me.profile;
        delete req.users.me.relationships;
        res.json(req.users.me || {});
      },

      update: async (req, res, next) => {
        try {
          const { newPassword = "", password = "", ...body } = req.body;

          if (!isValid(body, accountRepository.getSchema(), invalid.account)) {
            const error = new Error(errorCodes.INVALID_UPDATES);
            error.name = errorCodes.INVALID_UPDATES;
            throw error;
          }

          const { tokens, ...curr } = req.users.me;

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
