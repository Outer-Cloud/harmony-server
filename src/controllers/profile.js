module.exports = [
  "userRepository",
  (userRepository) => {
    return {
      get: async (req, res, next) => {
        try {
          const query = {
            _id: req.auth.profile,
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

          const result = await userRepository.get(opts);

          res.json(result);
        } catch (error) {
          next(error);
        }
      },

      update: async (req, res, next) => {
        try {
          const query = {
            _id: req.auth.profile,
          };

          const updates = req.body;

          const opt = {
            query,
            updates,
          };

          const result = await userRepository.update(opt);

          res.json(result);
        } catch (error) {
          next(error);
        }
      },

      delete: async (req, res, next) => {
        try {
          const query = {
            _id: req.auth.profile,
          };

          const opt = {
            query,
          };

          const result = await userRepository.delete(opt);

          res.json(result);
        } catch (error) {
          next(error);
        }
      },
    };
  },
];
