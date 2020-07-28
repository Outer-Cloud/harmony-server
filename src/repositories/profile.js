module.exports = [
  "profileModel",
  (profileModel) => {
    const get = async (opts) => {
      const profile = await profileModel
        .findOne(opts.query)
        .select({ __v: 0, ...opts.projection })
        .lean(opts.lean);

      return profile;
    };

    return {
      get,
      create: async (newProfile) => {
        const profile = new profileModel(newProfile);
        await profile.save();

        return profile;
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

      delete: async (id) => {
        return profileModel.findByIdAndDelete(id);
      },

      getSchema: () => {
        return profileModel.schema.paths;
      },
    };
  },
];
