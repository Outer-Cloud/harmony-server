const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const container = require("./container/container")();

const server = express();
const port = process.env.PORT || 3000;

//register dependencies
container.register("dbUrl", "mongodb://127.0.0.1:27017/test");
container.register("JWT_SECRET", process.env.JWT_SECRET || "adsfasdf123adf");
container.register("TOKEN_LIFE_TIME", +process.env.TOKEN_LIFE_TIME || 15000);
container.register("MAX_ALLOWED", +process.env.MAX_ALLOWED || 10000);
container.register("userRoute", {});
container.register("messageRoute", {});

//register factories

//auth
container.factory("auth", require("./middleware/authorization"));

//db
container.factory("connection", require("./db/dbConnection"));

//models
container.factory("userModel", require("./models/user"));
container.factory("loginModel", require("./models/login"));

//repositories
container.factory("userRepository", require("./repositories/user"));
container.factory("loginRepository", require("./repositories/login"));

//controllers
container.factory("profileController", require("./controllers/profile"));
container.factory("loginController", require("./controllers/login"));
container.factory("userController", require("./controllers/user"));
container.factory("relationshipController", require("./controllers/relationship"));

//routes
container.factory("routes", require("./routes/root"));
container.factory("profileRoute", require("./routes/profile"));
container.factory("loginRoute", require("./routes/login"));
container.factory('relationshipRoute', require("./routes/relationship"));
//container.factory('userRoute', require('./routes/user'));
//container.factory('messageRoute', require('./routes/message'));\

const routes = container.get("routes");

const staticAssetPath = path.join(__dirname, "../public");

server.use(bodyParser.json());
server.use(express.static(staticAssetPath));

require("./router")(server, routes);

server.use(require("./utils/error/handler"));

server.listen(port, () => {
  console.log("Server running on port: " + port);
});
