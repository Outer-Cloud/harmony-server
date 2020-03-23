const isValidUpdate = require('../utils/checkValidUpdate');

module.exports = ['userModel', (userModel) => {

    return {
        save: async (opts) => {
            const newUser = new User(opts.user);
            await newUser.save();

            return newUser;
        },

        update: async (opts) => {
            if (!isValidUpdate(opts.updates, userModel.schema)) {
                throw new Error('Invalid updates');
            }

            const updates = Object.keys(opts.updates);

            const user = await userModel.findOne({ _id: opts.id });
            updates.forEach((update) => {
                user[update] = opts.updates[update];
            });
            await user.save();

            return user;
        },

        delete: async (opts) => {
            const user = await userModel.findOne({ _id: opts.id });
            await user.remove();

            return user;
        },

        get: async (opts) => {
            const user = await userModel.findOne({ _id: opts.id });

            return user;
        },

        addRelationship: async (opts) => {
            
        },

        removeRelationship: async (opts) => {
            
        },
    }
}];