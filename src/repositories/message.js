module.exports = [
  "msgModel",
  (msgModel) => {
    const get = async (opt) => {
      const message = await msgModel.findOne(opt.query);

      return message;
    };

    return {
      create: async (opt) => {
        const newMessage = new msgModel(opt.query);
        await newMessage.save();

        return newMessage;
      },

      createMany: async (opt) => {
        const array = opt.queries;

        const messages = await msgModel.insertMany(array);

        return messages;
      },

      get,

      getMessageForRoom: async (opt) => {
        const messages = await msgModel.find(opt.query); //todo: sort and return limit

        const messageBunch = [];

        messages.forEach((message) => {
          messageBunch.push(message);
        });

        return messageBunch;
      },

      delete: async (opt) => {
        const message = await get(opt);
        await message.remove();
        return message;
      },

      update: async (opt) => {
        const message = await get(opt);
        const updates = Object.keys(opt.update);

        updates.forEach((update) => {
          message[update] = opt.update[update];
        });

        message.save();

        return message;
      },
      getSchema: () => {
        return msgModel.schema.paths;
      },
    };
  },
];
