
const express = require('express');

module.exports = ['userController', 'auth', (userController, auth) => {
    const router = new express.Router();

    router.post('/add-friend', userController.addRelationship(req, res, next));

    router.delete('/remove-friend', userController.removeRelationship(req, res, next));
    
    router.post('/block-user', userController.addRelationship(req, res, next));

    router.delete('/unblock-user', userController.removeRelationship(req, res, next));
    
    return router;
}];


