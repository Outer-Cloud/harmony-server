const errors = require("../utils/error/errors");
module.exports = [
    "msgModel",
    (msgModel) => {
        return{
            newMessage: async (opt) => {
                const newMessage = new msgModel(opt);
                await newMessage.save();

                return newMessage;
            },

            getMessage:async (opt) => {
                const message = await msgModel.findOne(opt.query);

                if (!message) {
                    throw new Error(errors.MESSAGE_NOT_EXIST);
                  }

                return message;

            },

            getMessageForRoom: async (opt) => {
                
            },

            editMessage: async(opt) =>{
                const message = await msgModel.update(opt.query,opt.update);

            }
        };
    },
];