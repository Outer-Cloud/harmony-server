const errors = require("../utils/error/errors");
module.exports = [
    "msgModel",
    (msgModel) => {

        const get = async (opt) => {
            const message = await msgModel.findOne(opt.query);

            if (!message) {
                throw new Error(errors.MESSAGE_NOT_EXIST);
              }

            return message;

        }

        return{
            create: async (opt) => {
                const newMessage = new msgModel(opt.query);
                await newMessage.save();

                return newMessage;
            },

            get,

            getMessageForRoom: async (opt) => {
                
            },

            delete: async(opt) => {
                const message = await get(opt);
                await message.remove();
                return message;
            },

            update: async(opt) =>{
                const message = await get(opt);
                const updates = Object.keys(opt.update);

                message[updates] = opt.update[updates];

                message.save();

                return message;

            }
        };
    },
];