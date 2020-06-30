const { get } = require("lodash")

module.exports = [
    "channelModel",
    (channelModel) => {
        //todo : finish this
        const get = async (opt) => {
            const channel;
            if(opt.hasOwnProperty('lean')){
                channel = channelModel.findOne(opt.query).lean;
            } else {
                channel = channelModel.findOne(opt.query);
            }

            return channel;
        }

        return{
            get,
            create: (opt) => {
                const newChannel = new channelModel(opt.query)
                await newChannel.save();

                return newChannel;
            },

            delete: async (opt) => {
                const channel = await get(opt);
                await channel.remove();
                return channel;
            },

            update: async (opt) => {
                const channel = await get(opt);
                const updates = Object.keys(opt.update);
        
                updates.forEach((update) => {
                  channel[update] = opt.update[update];
                });
        
                channel.save();
        
                return channel;
              },


        }


    }
]