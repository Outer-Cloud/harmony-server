const express = require('express');

module.exports = ['profileRoute', 'userRoute', 'messageRoute', (profileRoute, userRoute, messageRoute) => {

    const router = new express.Router();

    router.use('/profile', profileRoute);
    //router.use('/users', userRoute);
    //router.use('/message', messageRoute);

    return router;
}];