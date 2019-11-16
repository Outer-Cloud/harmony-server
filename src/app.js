const http = require('http')

const app = require('./server')
const socket = require('./socket')

require('./db/mongoose')
const httpServer = http.createServer(app)

socket.listen(httpServer)

const port = 3000

httpServer.listen(port,  function() {
    console.log(`Server listening on ${port}`)
})
