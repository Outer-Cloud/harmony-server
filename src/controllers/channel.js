module.exports = [
  "msgRepository",
  "channelRepository",
  "utils",
  "errors",
  (msgRepository, channelRepository, utils, errors) => {
    const errorCodes = errors.errorCodes;
    const { isValid, invalid } = utils;
    //todo: finish this
    return {
      getChannel: async (req, res, next) => {
        try {
          const query = {
            _id: req.params.id,
          };
          const opt = {
            query,
          };

          const channel = await channelRepository.get(opt);
          if (!channel) {
            const err = new Error(errorCodes.CHANNEL_NOT_EXIST);
            err.name = errorCodes.CHANNEL_NOT_EXIST;
            throw err;
          }
          res.json(channel);
        } catch (error) {
          next(error);
        }
      },
      deleteChannel: async (req, res, next) => {
        try {
          const query = {
            _id: req.params.id,
          };
          const opt = {
            query,
          };

          const channel = await channelRepository.get(opt);
          if (!channel) {
            const err = new Error(errorCodes.CHANNEL_NOT_EXIST);
            err.name = errorCodes.CHANNEL_NOT_EXIST;
            throw err;
          }

          const deleted = await channelRepository.delete(opt);

          res.json(deleted);
        } catch (error) {
          next(error);
        }
      },
      editChannel: async (req, res, next) => {
        try {
          const query = {
            _id: req.params.id,
          };

          const update = {
            update: req.body,
          };

          const opt = {
            query,
            update,
          };

          const channel = await channelRepository.get({ query });
          if (!channel) {
            const err = new Error(errorCodes.CHANNEL_NOT_EXIST);
            err.name = errorCodes.CHANNEL_NOT_EXIST;
            throw err;
          }

          const ret = await channelRepository.update(opt);

          res.json(channel);
        } catch (error) {
          next(error);
        }
      },
      getChannelMessage: async (req, res, next) => {
        try {
          const query = {
            channel: req.params.id,
          };
          const opt = {
            query,
          };

          messages = msgRepository.getMessageForChannel(opt);

          res.json(messages);
        } catch (error) {
          next(error);
        }
      },
    };
  },
];
