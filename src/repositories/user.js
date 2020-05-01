const isValid = require('../utils/validatation');

module.exports = ['userModel', (userModel) => {

    return {
        save: async (opts) => {
            if (!isValid(opts.user, userModel.schema)) {
                throw new Error('Invalid object');
            }

            const newUser = new User(opts.user);
            await newUser.save();

            return newUser;
        },

        update: async (opts) => {
            if (!isValid(opts.updates, userModel.schema)) {
                throw new Error('Invalid updates');
            }

            const updates = Object.keys(opts.updates);

            const user = await userModel.findOne(opts.query);
            updates.forEach((update) => {
                user[update] = opts.updates[update];
            });
            await user.save();

            return user;
        },

        delete: async (opts) => {
            const user = await userModel.findOne(opts.query);
            await user.remove();

            return user;
        },

        get: async (opts) => {
            const user = await userModel.findOne(opts.query).select(opts.projection);

            return user;
        },

        addFriend: async (opts) => {

        },

        removeFriend: async (opts) => {

        },

        blockUser: async (opts) => {

        },

        unblockUser: async (opts) => {

        },

        joinServer: async (opts) => {

        },

        leaveServer: async (opts) => {

        },

        leaveDM: async (opts) => {

        },

        addUserToDM: async (opts) => {

        },

        addToUserFriendList: async (opts) => {

        }
    }
}];