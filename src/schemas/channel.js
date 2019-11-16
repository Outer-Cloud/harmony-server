const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    message: [{
        type: mongoose.Schema,ObjectId, 
        required: true,
        ref: 'Message'
    }],
    users: [{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    }]
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel