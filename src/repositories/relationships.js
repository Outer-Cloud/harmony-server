module.exports = [
  "relationshipsModel",
  "values",
  "errors",
  (relationshipsModel, values, errors) => {
    const { OUTBOUND_REQUEST } = values.constants;
    const errorCodes = errors.errorCodes;

    const get = async (opts) => {
      const relationships = await relationshipsModel
        .findOne(opts.query)
        .select(opts.projection)
        .lean(opts.lean);

      return relationships;
    };

    return {
      get,
      exists: (query) => relationshipsModel.exists(query),
      create: async (account) => {
        const newRelationships = new relationshipsModel({ account });
        await newRelationships.save();

        return newRelationships;
      },

      delete: (id) => {
        return relationshipsModel.findByIdAndDelete(id);
      },

      addToRelationship: async (id, toAdd, type) => {
        const result = await relationshipsModel.findByIdAndUpdate(
          id,
          { $addToSet: { [type]: toAdd } },
          { new: true }
        );

        return result[type];
      },

      removeFromRelationship: async (id, toRemove, type) => {

        const result = await relationshipsModel.findByIdAndUpdate(id, {
          $pull: {
            [type]: toRemove 
          },
        });

        return result[type];
      },
    };
  },
];
