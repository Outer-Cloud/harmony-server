const invalidFields = ['_id', '__v', 'tokens', 'avatar', 'userName']

module.exports = (query, schema) => {
    const validFields = Object.keys(schema.schema.paths).filter((field) => {
        return !invalidFields.includes(field);
    });

    const updateFields = Object.keys(query);

    return updateFields.every((field) => {
        return validFields.includes(field);
    });
};;