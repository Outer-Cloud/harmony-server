const constants = require("../utils/values").constants;

module.exports = [
  "userRepository",
  "MAX_ALLOWED",
  (userRepository, MAX_ALLOWED) => {
    return {
      createProfile: async (userName) => {
        try {
          const randInt = Math.floor(Math.random() * MAX_ALLOWED + 1);

          const newProfile = await userRepository.create({
            user: {
              userName,
              discriminator: randInt < 1000 ? `0${randInt}` : randInt,
              name: constants.DEFAULT_NAME,
              age: constants.DEFAULT_AGE,
              language: constants.EN,
              status: constants.STATUS_ONLINE,
            },
          });

          return newProfile._id;
        } catch (error) {}
      },

      getUserById: async (req, res, next) => {},
    };
  },
];
