const express = require("express");

module.exports = [
  "usersController",
  "meRoute",
  (usersController, meRoute) => {
    const router = new express.Router();

    // /user routes
    router.post("/", usersController.create);
    router.get("/:id", usersController.get);

    // /user/me routes
    router.use("/me", meRoute);

    return router;
  },
];
