const express = require('express');
const auth = require('../middleware/authorization');

module.exports = (userController) => {
    const router = new express.Router();

    router.get('/me', auth, (req, res) => {
       userController.get(req, res);
    });

    router.put('/me', auth, async (req, res) => {
        userController.update(req, res);
    });

    router.delete('/me', auth, async (req, res) => {
        userController.delete(req, res);
    });
};

