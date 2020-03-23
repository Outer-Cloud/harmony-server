const path = require('path');
const express = require('express');

const router = require('./router');
const dbFactory = require('./db/mongoose');

const MONGO_DB = 'mongodb://localhost/test';

const server = express();
const port = process.env.PORT || 3000;

const staticAssetPath = path.join(__dirname,'../public');

server.use(express.json());
server.use(express.static(staticAssetPath));

const db = dbFactory(MONGO_DB);

router(server);

server.listen(port, () => {
    console.log('Server running on port: ' + port);
});
