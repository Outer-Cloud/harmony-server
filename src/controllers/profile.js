const errors = require("../utils/error/errors");
const constants = require("../utils/values").constants;
const httpStatus = require("../utils/httpStatus");

module.exports = [
  "profileRepository",
  (profileRepository) => {
    return {
      create: async (req, res, next) => {
        try {
          const newProfile = await profileRepository.create({
            profile: {
              ...req.body,
              language: req.body.language || constants.EN,
              status: constants.STATUS_ONLINE,
              account: req.auth.id,
            },
          });

          res.status(httpStatus.CREATED).json(newProfile);
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
