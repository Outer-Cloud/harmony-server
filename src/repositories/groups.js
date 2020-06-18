
module.exports = [
  "groupsModel",
  (groupsModel) => {
    const get = async (opts) => {
      const groups = await groupsModel
        .findOne(opts.query)
        .select(opts.projection)
        .lean(opts.lean);

      return groups;
    };

    return {
      get,
      create: async (account) => {
        const newGroups = new groupsModel({ account });
        await newGroups.save();

        return newGroups;
      },

      delete: async (opts) => {
        const groups = await get({ query: opts.query });
        await groups.remove();

        return groups;
      },

      joinServer: async (opts) => {},

      leaveServer: async (opts) => {},

      leaveDM: async (opts) => {},

      addUserToDM: async (opts) => {},
    };
  },
];
