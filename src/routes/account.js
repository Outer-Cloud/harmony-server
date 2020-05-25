const express = require("express");

module.exports = [
  "accountController",
  "auth",
  (accountController, auth) => {
    const router = new express.Router();

    router.post("/", accountController.create);
    router.put("/", auth, accountController.update);
    router.delete("/", auth, accountController.delete);
    router.post("/login", accountController.login);
    router.delete("/logout", auth, accountController.logout);
    router.delete("/logoutAll", auth, accountController.logoutAll);

    return router;
  },
];
