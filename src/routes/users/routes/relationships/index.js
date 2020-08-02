const express = require("express");

module.exports = [
  "blockRoute",
  "friendsRoute",
  "requestsRoute",
  (blockRoute, friendsRoute, requestsRoute) => {
    const router = new express.Router();

    router.use("/block", blockRoute);
    router.use("/friends", friendsRoute);
    router.use("/requests", requestsRoute);

    return router;
  },
];
