module.exports = [
  "profileRepository",
  "errors",
  "values",
  "httpStatus",
  "utils",
  (profileRepository, errors, values, httpStatus, utils) => {
    const codes = httpStatus.statusCodes;
    const constants = values.constants;
    const errorCodes = errors.errorCodes;
    const { isValid, invalid } = utils;

    return {
      create: async (req, res, next) => {
        try {
          if (!isValid(req.body, profileRepository.getSchema(), invalid.profile)) {
            const error = new Error(errorCodes.INVALID_UPDATES);
            error.name = errorCodes.INVALID_UPDATES;
            throw error;
          }

          const newProfile = await profileRepository.create({
            profile: {
              ...req.body,
              language: req.body.language || constants.EN,
              status: constants.STATUS_ONLINE,
              account: req.auth.id,
            },
          });

          res.status(codes.CREATED).json(newProfile);
        } catch (error) {
          next(error);
        }
      },

      get: async (req, res, next) => {
        try {
          const query = {
            account: req.auth.id,
          };

          const projection = {
            servers: 0,
            directMessages: 0,
            friends: 0,
            blocked: 0,
            pending: 0,
            _id: 0,
            __v: 0,
          };

          const opts = {
            query,
            projection,
            lean: true,
          };

          const result = await profileRepository.get(opts);

          res.json(result || {});
        } catch (error) {
          next(error);
        }
      },

      update: async (req, res, next) => {
        try {
          if (!isValid(req.body, profileRepository.getSchema(), invalid.profile)) {
            const error = new Error(errorCodes.INVALID_UPDATES);
            error.name = errorCodes.INVALID_UPDATES;
            throw error;
          }

          const query = {
            account: req.auth.id,
          };

          const updates = req.body;

          const opt = {
            query,
            updates,
          };

          const result = await profileRepository.update(opt);

          res.json(result);
        } catch (error) {
          next(error);
        }
      },
    };
  },
];
