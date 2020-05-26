const base = ["_id", "__v"];

module.exports = {
  invalid: {
    base,
    account: [...base, "tokens", "discriminator"],
    profile: [...base, "avatar", "account"],
  },
  isValid: (query, schema, invalid) => {
    const validFields = Object.keys(schema.paths).filter((field) => {
      return !invalid.includes(field);
    });

    const updateFields = Object.keys(query);

    return updateFields.every((field) => {
      return validFields.includes(field);
    });
  },
};
