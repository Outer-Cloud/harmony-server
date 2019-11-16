const express = require('express')

const router = new express.Router()

router.get('/', function(req, res) {
    res.send('Hello')
})


module.exports = router