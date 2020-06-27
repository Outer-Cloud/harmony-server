const express = require("express");

module.exports = [
  "accountRoute",
  (accountRoute) => {
    const router = new express.Router();

    // /account
    router.use("/account", accountRoute);

    return router;
  },
];
