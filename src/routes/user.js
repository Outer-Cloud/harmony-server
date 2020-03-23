
const express = require('express');
const auth = require('../middleware/authorization');

module.exports = ['userController', 'auth', (userController, auth, ) => {
    const router = new express.Router();

    router.post('/', auth, userController.save(req, res, next));

    router.get('/:id', userController.get(req, res, next));

    router.put('/:relationship', userController.addRelationship(req, res, next));

    router.delete('/:relationship', userController.removeRelationship(req, res, next));

    return router;
}];


