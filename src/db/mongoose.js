const mongoose = require('mongoose')

const MONGO_DB = 'mongodb://localhost/test'

mongoose.connect(MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true
})