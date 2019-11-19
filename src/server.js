const path = require('path');
const express = require('express');

const router = require('./router');
const initDB = require('./db/mongoose');

const server = express();
const port = process.env.PORT || 3000;

const staticAssetPath = path.join(__dirname,'../public');

server.use(express.json());
server.use(express.static(staticAssetPath));

initDB();
router(server);

server.listen(port, () => {
    console.log('Server running on port: ' + port);
});