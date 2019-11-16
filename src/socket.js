
const socket_io = require('socket.io')


module.exports.listen = function(httpServer){
    const io = socket_io(httpServer)

    io.on('connection', function(socket){
        console.log('a user connected')
        
        socket.on('disconnect', function(){
            console.log('a user disconnected')
        })

        socket.on('sendMessage', function(message){
            console.log(message)
        })
    })
}

