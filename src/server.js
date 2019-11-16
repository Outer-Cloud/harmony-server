const path = require('path')

const express = require('express')

const indexRoute = require('./routes/index')
const userRoute = require('./routes/user')

const server = express()

const staticAssetPath = path.join(__dirname,'../public')

server.use(express.json())
server.use(express.static(staticAssetPath))

server.use(indexRoute)
server.use(userRoute)

module.exports = server