const mongoose = require('mongoose');

const MONGO_DB = 'mongodb://localhost/test';

module.exports = () => {
    mongoose.connect(MONGO_DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
}