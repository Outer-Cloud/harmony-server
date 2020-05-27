module.exports = [
  "msgRepository",
  (msgRepository) => {
    return {
      newMessage: async (req, res, next) => {
        const time = new Date(req.body.time);

        const query = {
          text: req.body.text,
          author: req.body.author,
          room: req.body.room,
          isPinned: req.body.isPinned,
          time: time,
        };

        const opt = {
          query,
        };

        const result = await msgRepository.create(opt);

        res.json(result);
      },

      insertMany: async (reqs, res, next) => {
        const queries = [];

        for (i in reqs.body) {
          const req = reqs.body[i];

          const time = new Date(req.time);

          const query = {
            text: req.text,
            author: req.author,
            room: req.room,
            isPinned: req.isPinned,
            time: time,
          };
          queries.push(query);
        }

        const opt = {
          queries,
        };

        const result = await msgRepository.createMany(opt);

        res.json(result);
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

          res.json(message);
        } catch (error) {
          next(error);
        }
      },

      editMessage: async (req, res, next) => {
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

        const ret = await msgRepository.update(opt);
        res.json(ret);
      },

      deleteMessage: async (req, res, next) => {
        const query = {
          _id: req.body.ID,
        };

        const opt = {
          query,
        };

        const ret = await msgRepository.delete(opt);
        res.json(ret);
      },
    };
  },
];
