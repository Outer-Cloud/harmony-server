const { isValid, invalid } = require("../utils/validation");
const errors = require("../utils/error/errors");

module.exports = [
  "profileModel",
  (profileModel) => {
    const get = async (opts) => {
      const profile = await profileModel
        .findOne(opts.query)
        .select(opts.projection)
        .lean(opts.lean);

      return profile;
    };

    return {
      get,
      create: async (opts) => {
        const newProfile = new profileModel(opts.profile);
        await newProfile.save();

        return newProfile;
      },

      update: async (opts) => {
        if (!isValid(opts.updates, profileModel.schema, invalid.profile)) {
          throw new Error("Invalid updates");
        }

        const updates = Object.keys(opts.updates);

        const profile = await get({ query: opts.query });
        updates.forEach((update) => {
          profile[update] = opts.updates[update];
        });
        await profile.save();

        return profile;
      },

      delete: async (opts) => {
        const profile = await get({ query: opts.query });
        await profile.remove();

        return profile;
      },
    };
  },
];
