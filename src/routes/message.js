const express = require('express');

const msg = require('../schemas/message');

const router = new express.Router;

router.post('/message',function(req, res){
    res.send(req.body.text);
})


module.exports = router;