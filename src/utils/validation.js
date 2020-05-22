const base = ["_id", "__v"];

module.exports = {
  filters: {
    base,
    loginCreation: [...base, "tokens"],
    loginUpdate: [...base, "tokens", "profile"],
    profileUpdate: [...base, "avatar", "discriminator"],
  },
  isValid: (query, schema, filter) => {
    const validFields = Object.keys(schema.paths).filter((field) => {
      return !filter.includes(field);
    });

    const updateFields = Object.keys(query);

    return updateFields.every((field) => {
      return validFields.includes(field);
    });
  },
};
