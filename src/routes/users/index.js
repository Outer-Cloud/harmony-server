const express = require("express");

module.exports = [
  "auth",
  "attachUser",
  "usersController",
  "meRoute",
  (auth, attachUser, usersController, meRoute) => {
    const router = new express.Router();

    // /user routes
    router.post("/", usersController.create);
    router.get("/:id", usersController.get);

    // /user/me routes
    router.use("/me", auth, attachUser(true), meRoute);

    return router;
  },
];
