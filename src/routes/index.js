const express = require('express');

const userRoute = require('./user');
const msgRoute = require('./message');

const router = new express.Router();

router.use('/users', userRoute);
router.use('/message',msgRoute);

module.exports = router