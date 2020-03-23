const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    room: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Room'
    },
    isPinned: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = ['connection', (connection) => {
    return connection.model('Message', messageSchema);
}]