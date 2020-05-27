const express = require("express");

module.exports = [
  "accountController",
  "auth",
  (accountController, auth) => {
    const router = new express.Router();

    router.post("/", accountController.create);
    router.put("/", auth, accountController.update);
    router.delete("/", auth, accountController.delete);

    return router;
  },
];
