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

      getSchema: () => {
        return profileModel.schema.paths;
      },
    };
  },
];
