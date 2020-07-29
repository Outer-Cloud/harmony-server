const express = require("express");

module.exports = [
  "accountRoute",
  "profileRoute",
  "relationshipsRoute",
  (accountRoute, profileRoute, relationshipsRoute) => {
    const router = new express.Router();

    // /account
    router.use("/account", accountRoute);
    router.use("/profile", profileRoute);
    router.use("/relationships", relationshipsRoute);

    return router;
  },
];
