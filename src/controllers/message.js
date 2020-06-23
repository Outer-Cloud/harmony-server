module.exports = [
  "msgRepository",
  "utils",
  "errors",
  (msgRepository, utils, errors) => {
    const errorCodes = errors.errorCodes;
    const { isValid, invalid } = utils;

    return {
      newMessage: async (req, res, next) => {
        try {
          if (req.body.text === "") {
            const err = new Error(errorCodes.MESSAGE_NO_TEXT);
            err.name = errorCodes.MESSAGE_NO_TEXT;
            throw err;
          }

          if (!isValid(req.body, msgRepository.getSchema(), invalid.base)) {
            const error = new Error(errorCodes.INVALID_OBJECT);
            error.name = errorCodes.INVALID_OBJECT;
            throw error;
          }

          const time = new Date(req.body.time);

          const query = {
            text: req.body.text,
            author: req.auth.id,
            room: req.body.room,
            isPinned: req.body.isPinned,
            time: time,
          };

          const opt = {
            query,
          };

          const result = await msgRepository.create(opt);

          res.json(result);
        } catch (error) {
          next(error);
        }
      },

      getRoom: async (req, res, next) => {
        try {
          const query = {
            channel: req.params.room,
          };

          const opt = {
            query,
          };

          const message = await msgRepository.getMessageForChannel(opt);

          res.json(message);
        } catch (error) {
          next(error);
        }
      },

      getMessage: async (req, res, next) => {
        try {
          const query = {
            _id: req.params.id,
          };

          const opt = {
            query,
          };

          const message = await msgRepository.get(opt);
          if (!message) {
            const err = new Error(errorCodes.MESSAGE_NOT_EXIST);
            err.name = errorCodes.MESSAGE_NOT_EXIST;
            throw err;
          }

          res.json(message);
        } catch (error) {
          next(error);
        }
      },

      editMessage: async (req, res, next) => {
        try {
          const query = {
            _id: req.params.id,
          };

          const update = {
            text: req.body.text,
          };

          const opt = {
            query,
            update,
          };

          const message = await msgRepository.get({
            query,
          });

          if (!message) {
            const err = new Error(errorCodes.MESSAGE_NOT_EXIST);
            err.name = errorCodes.MESSAGE_NOT_EXIST;
            throw err;
          }

          if (!(message.author == req.auth.id)) {
            const err = new Error(errorCodes.MESSAGE_AUTHOR_ID_MISMATCH);
            err.name = errorCodes.MESSAGE_AUTHOR_ID_MISMATCH;
            throw err;
          }

          if (req.body.text === "") {
            const err = new Error(errorCodes.MESSAGE_NO_TEXT);
            err.name = errorCodes.MESSAGE_NO_TEXT;
            throw err;
          }

          const ret = await msgRepository.update(opt);
          res.json(ret);
        } catch (error) {
          next(error);
        }
      },

      deleteMessage: async (req, res, next) => {
        try {
          const query = {
            _id: req.params.id,
          };

          const opt = {
            query,
          };

          const message = await msgRepository.get(opt);

          if (!message) {
            const err = new Error(errorCodes.MESSAGE_NOT_EXIST);
            err.name = errorCodes.MESSAGE_NOT_EXIST;
            throw err;
          }

          if (!(message.author == req.auth.id)) {
            const err = new Error(errorCodes.MESSAGE_AUTHOR_ID_MISMATCH);
            err.name = errorCodes.MESSAGE_AUTHOR_ID_MISMATCH;
            throw err;
          }

          const ret = await msgRepository.delete(opt);
          res.json(ret);
        } catch (error) {
          next(error);
        }
      },
    };
  },
];
