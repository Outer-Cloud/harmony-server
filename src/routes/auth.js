const express = require("express");

module.exports = [
  "accountController",
  "auth",
  (accountController, auth) => {
    const router = new express.Router();

    router.post("/login", accountController.login);
    router.delete("/logout/:token?", auth, accountController.logout);

    return router;
  },
];
