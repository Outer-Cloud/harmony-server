const express = require("express");

module.exports = [
  "accountController",
  (accountController) => {
    const router = new express.Router();

    router.get("/", accountController.get);
    router.put("/", accountController.update);
    router.delete("/", accountController.delete);

    return router;
  },
];
