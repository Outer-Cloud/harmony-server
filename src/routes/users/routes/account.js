const express = require("express");

module.exports = [
  "accountController",
  "auth",
  (accountController, auth) => {
    const router = new express.Router();

    router.get("/", auth, accountController.get);
    router.put("/", auth, accountController.update);
    router.delete("/", auth, accountController.delete);

    return router;
  },
];