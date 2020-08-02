module.exports = [
  "_",
  "accountRepository",
  (_, accountRepository) => (isUser) => async (req, res, next) => {
    try {
      const opts = {
        lean: true,
      };

      req.users = req.users || {};

      if (isUser) {
        opts.query = {
          _id: req.auth.id,
        };
        req.users.me = await accountRepository.get(opts);
      } else {
        opts.query = (req.params.id && { _id: req.params.id }) || req.body;

        req.users.target =
          (!_.isEmpty(opts.query) && (await accountRepository.get(opts))) || {};
      }

      next();
    } catch (error) {
      next(error);
    }
  },
];
