const errors = require("../utils/error/errors");
module.exports = [
  "msgRepository",
  (msgRepository) => {
    return {
      newMessage: async (req, res, next) => {
        try {
          if (req.body.text === "") {
            const err = new Error(errors.MESSAGE_NO_TEXT);
            err.name = errors.MESSAGE_NO_TEXT;
            throw err;
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
            room: req.body.ID,
          };

          const opt = {
            query,
          };

          const message = await msgRepository.getMessageForRoom(opt);

          res.json(message);
        } catch (error) {
          next(error);
        }
      },

      getMessage: async (req, res, next) => {
        try {
          const query = {
            _id: req.body.ID,
          };

          const opt = {
            query,
          };

          const message = await msgRepository.get(opt);
          if (!message) {
            const err = new Error(errors.MESSAGE_NOT_EXIST);
            err.name = errors.MESSAGE_NOT_EXIST;
            throw err;
          }

          res.json(message);
        } catch (error) {
          console.log(error);
          next(error);
        }
      },

      editMessage: async (req, res, next) => {
        try {
          const query = {
            _id: req.body.ID,
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
            const err = new Error(errors.MESSAGE_NOT_EXIST);
            err.name = errors.MESSAGE_NOT_EXIST;
            throw err;
          }

          if (!(message.author == req.auth.id)) {
            const err = new Error(errors.MESSAGE_AUTHOR_ID_MISMATCH);
            err.name = errors.MESSAGE_AUTHOR_ID_MISMATCH;
            throw err;
          }

          if (req.body.text === "") {
            const err = new Error(errors.MESSAGE_NO_TEXT);
            err.name = errors.MESSAGE_NO_TEXT;
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
            _id: req.body.ID,
          };

          const opt = {
            query,
          };

          const message = await msgRepository.get(opt);

          if (!message) {
            const err = new Error(errors.MESSAGE_NOT_EXIST);
            err.name = errors.MESSAGE_NOT_EXIST;
            throw err;
          }

          if (!(message.author == req.auth.id)) {
            const err = new Error(errors.MESSAGE_AUTHOR_ID_MISMATCH);
            err.name = errors.MESSAGE_AUTHOR_ID_MISMATCH;
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
