module.exports = [
  "profileRepository",
  "errors",
  "utils",
  (profileRepository, errors, utils) => {
    const errorCodes = errors.errorCodes;
    const { isValid, invalid } = utils;

    return {
      get: async (req, res, next) => {
        try {
          const query = {
            _id: req.users.me.profile,
          };

          const projection = {
            _id: 0,
          };

          const opts = {
            query,
            projection,
            lean: {
              virtuals: true,
            },
          };

          const result = await profileRepository.get(opts);
          delete result.id;

          res.json(result || {});
        } catch (error) {
          next(error);
        }
      },

      update: async (req, res, next) => {
        try {
          if (
            !isValid(req.body, profileRepository.getSchema(), invalid.profile)
          ) {
            const error = new Error(errorCodes.INVALID_UPDATES);
            error.name = errorCodes.INVALID_UPDATES;
            throw error;
          }

          const query = {
            _id: req.users.me.profile,
          };

          const updates = req.body;

          const opt = {
            query,
            updates,
          };

          const result = await profileRepository.update(opt);
          delete result._id;
          delete result.id;

          res.json(result);
        } catch (error) {
          next(error);
        }
      },
    };
  },
];
