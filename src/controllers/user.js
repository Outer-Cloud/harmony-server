const constants = require("../utils/values").constants;

module.exports = [
  "userRepository",
  (userRepository) => {
    return {
      createProfile: async () => {
        const newProfile = await userRepository.create({
          user: {
            name: constants.DEFAULT_NAME,
            age: constants.DEFAULT_AGE,
            language: constants.EN,
            status: constants.STATUS_ONLINE,
          },
        });

        return newProfile._id;
      },

      addToUserFriendList: async (req, res, next) => {},

      getUserById: async (req, res, next) => {},
    };
  },
];
