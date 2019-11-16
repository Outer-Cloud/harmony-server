const invalidFields = ['_id', '__v', 'tokens', 'avatar']

const isValidUpdate = function(query, schema){
    const validFields = Object.keys(schema.schema.paths).filter(function(field) {
        return !invalidFields.includes(field)
    })

    const updateFields = Object.keys(query)

    return updateFields.every(function(field) {
        return validFields.includes(field)
    })
}

module.exports = isValidUpdate