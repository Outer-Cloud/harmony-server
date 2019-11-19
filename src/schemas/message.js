const mongoose = require('mongoose')

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
    channel: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Channel'
    }

})

const Message = mongoose.model('Message',messageSchema)