const path = require('path');
const express = require('express');

const router = require('./router');
const initDB = require('./db/mongoose');

<<<<<<< HEAD
const indexRoute = require('./routes/index')
const userRoute = require('./routes/user')
const msgRoute = require('./routes/message')
=======
const server = express();
const port = process.env.PORT || 3000;
>>>>>>> 189599fab2a8064ca74a7c190afd67f9e37394bb

const staticAssetPath = path.join(__dirname,'../public');

server.use(express.json());
server.use(express.static(staticAssetPath));

initDB();
router(server);

<<<<<<< HEAD
server.use(indexRoute)
server.use(userRoute)
server.use(msgRoute)

module.exports = server
=======
server.listen(port, () => {
    console.log('Server running on port: ' + port);
});
>>>>>>> 189599fab2a8064ca74a7c190afd67f9e37394bb
