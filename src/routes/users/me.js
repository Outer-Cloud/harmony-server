const express = require("express");

module.exports = [
  "accountRoute",
  "profileRoute",
  (accountRoute, profileRoute) => {
    const router = new express.Router();

    // /account
    router.use("/account", accountRoute);
    router.use("/profile", profileRoute);

    return router;
  },
];
