const express = require('express')

const User = require('../schemas/user')

const auth = require('../middleware/authorization')

const isValidUpdate = require('../utils/checkValidUpdate')

const router = new  express.Router()

router.post('/users', function(req, res) {
    const newUser = new User({
        ...req.body
    })
   newUser.save()
   .then(function(user){
        res.send(user)
   }).catch(function(error){
       res.status(500).send(error)
   })

})

router.get('/users/me', auth, function(req, res){
    res.send(req.user)
})

router.patch('/users/me', auth, function(req, res){
    if(!isValidUpdate(req.body, User)){
        return res.status(400).send({error: 'Invalid update.'})
    }

    const updates = Object.keys(req.body)

    updates.forEach(function(update) {
        req.user[update] = req.body[update]
    })

    req.user.save().then(function(user){
        res.send(user)
    }).catch(function(err){
        res.status(500).send()
    })
})

router.delete('/users/me', auth, function(req, res){
    req.user.remove()
    .then(function(user){
        res.send(user)
    })
    .catch(function(err){
        res.status(400).send()
    })
})

router.post('/users/login', function(req, res){
    User.findByCredentials(req.body.email, req.body.password)
    .then(function(user){
        return Promise.all([user, user.generateAuthToken()])
    })
    .then(function([user, token]){
        res.send({user, token})
    })
    .catch(function(err){
        res.status(400).send(err)
    })
})

router.post('/users/logout', auth, function(req, res){
    req.user.tokens = req.user.tokens.filter(function(token){
        return req.token !== token
    })
    
    req.user.save()
    .then(function(user){
        res.send()
    })
    .catch(function(err){
        res.status(500).send()
    })
})

router.post('/users/logoutAll', auth, function(req, res){
    req.user.tokens = []

    req.user.save()
    .then(function(user){
        res.send()
    })
    .catch(function(err){
        res.status(500).send()
    })
})

module.exports = router