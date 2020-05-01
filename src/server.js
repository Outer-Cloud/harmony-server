const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')

const container = require('./container/container')();

const server = express();
const port = process.env.PORT || 3000;

//register dependencies
container.register('dbUrl', 'mongodb://127.0.0.1:27017/test');
container.register('userRoute', {});
container.register('messageRoute', {});

//auth
container.register('auth', require('./middleware/authorization'));

//register factories

//db 
container.factory('connection', require('./db/dbConnection'));

//models
container.factory('userModel', require('./models/user'));

//repositories
container.factory('userRepository', require('./repositories/user'));

//controllers
container.factory('profileController', require('./controllers/profile'));

//routes
container.factory('routes', require('./routes/root'));
container.factory('profileRoute', require('./routes/profile'));
//container.factory('userRoute', require('./routes/user'));
//container.factory('messageRoute', require('./routes/message'));\

const routes = container.get('routes');

const staticAssetPath = path.join(__dirname,'../public');

server.use(bodyParser.json());
server.use(express.static(staticAssetPath));

require('./router')(server, routes);

server.listen(port, () => {
    console.log('Server running on port: ' + port);
});
