const express = require("express");

module.exports = [
  "authController",
  "auth",
  (authtController, auth) => {
    const router = new express.Router();

    router.post("/login", authtController.login);
    router.delete("/logout/:token?", auth, authtController.logout);

    return router;
  },
];
