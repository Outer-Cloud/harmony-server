const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    server: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Server'
    },
    category: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Category'
    }
});

module.exports = ['connection', 'base', (connection, base) => {
    const schema = base.discriminator('', channelSchema);
    return connection.model('Channel', schema);
}];