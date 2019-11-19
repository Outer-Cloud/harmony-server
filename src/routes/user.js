const express = require('express');

const User = require('../schemas/user');

const auth = require('../middleware/authorization');

const isValidUpdate = require('../utils/checkValidUpdate');

const router = new express.Router();

router.post('/', async (req, res) => {
    const newUser = new User({
        ...req.body
    });
    try {
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

router.get('/me', auth, (req, res) => {
    res.send(req.user);
})

router.patch('/me', auth, async (req, res) => {
    if (!isValidUpdate(req.body, User)) {
        return res.status(400).send({ error: 'Invalid update.' });
    }

    const updates = Object.keys(req.body);

    updates.forEach((update) => {
        req.user[update] = req.body[update];
    });

    try {
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})

router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(400).send();
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
})

router.post('/logout', auth, async (req, res) => {
    req.user.tokens = req.user.tokens.filter((token) => {
        return req.token !== token;
    })

    try {
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

router.post('/logoutAll', auth, async (req, res) => {
    req.user.tokens = [];

    try {
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = router;