const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const container = require("./container/container")();

const server = express();
const port = process.env.PORT || 8080;

//register dependencies
container.register("dbUrl", "mongodb://127.0.0.1:27017/test");
container.register("JWT_SECRET", process.env.JWT_SECRET || "adsfasdf123adf");
container.register("TOKEN_LIFE_TIME", +process.env.TOKEN_LIFE_TIME || 15000);
container.register("MAX_ALLOWED", +process.env.MAX_ALLOWED || 10000);

//packages
container.register("_", require("lodash"));
container.register("bcrypt", require("bcrypt"));
container.register("jsonwebtoken", require("jsonwebtoken"));

container.register("httpStatus", require("./utils/httpStatus"));
container.register("values", require("./utils/values"));

//register factories
//utils
container.factory("utils", require("./utils/utils"));
container.factory("errors", require("./utils/error/errors"));
container.factory("repoError", require("./utils/error/repoError"));
container.factory("errorHandler", require("./utils/error/handler"));

//middleware
container.factory("auth", require("./middleware/authorization"));
container.factory("attachUser", require("./middleware/account"));

//db
container.factory("connection", require("./db/dbConnection"));

//models
container.factory("profileModel", require("./models/profile"));
container.factory("relationshipsModel", require("./models/relationships"));
container.factory("groupsModel", require("./models/groups"));
container.factory("accountModel", require("./models/account"));
container.factory("msgModel", require("./models/message"));

//repositories
container.factory("profileRepository", require("./repositories/profile"));
container.factory(
  "relationshipsRepository",
  require("./repositories/relationships")
);
container.factory("groupsRepository", require("./repositories/groups"));
container.factory("accountRepository", require("./repositories/account"));
container.factory("msgRepository", require("./repositories/message"));

//controllers
container.factory("profileController", require("./controllers/profile"));
container.factory("usersController", require("./controllers/users"));
container.factory("accountController", require("./controllers/account"));
container.factory("authController", require("./controllers/auth"));
container.factory(
  "relationshipsController",
  require("./controllers/relationships")
);
container.factory("msgController", require("./controllers/message"));

//routes
container.factory("routes", require("./routes/"));
container.factory("usersRoute", require("./routes/users"));
container.factory("meRoute", require("./routes/users/me"));
container.factory("profileRoute", require("./routes/users/routes/profile"));
container.factory("accountRoute", require("./routes/users/routes/account"));
container.factory(
  "relationshipsRoute",
  require("./routes/users/routes/relationships")
);
container.factory(
  "blockRoute",
  require("./routes/users/routes/relationships/block")
);
container.factory(
  "friendsRoute",
  require("./routes/users/routes/relationships/friends")
);
container.factory(
  "requestsRoute",
  require("./routes/users/routes/relationships/requests")
);
container.factory("authRoute", require("./routes/auth"));
container.factory("messageRoute", require("./routes/message"));

const routes = container.get("routes");

const staticAssetPath = path.join(__dirname, "../public");

server.use(bodyParser.json());
server.use(express.static(staticAssetPath));

require("./router")(server, routes);

server.use(container.get("errorHandler"));

server.listen(port, () => {
  console.log("Server running on port: " + port);
});
