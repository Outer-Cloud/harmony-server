const express = require("express");

module.exports = [
  "profileRoute",
  "messageRoute",
  "accountRoute",
  "authRoute",
  "relationshipsRoute",
  (
    profileRoute,
    messageRoute,
    accountRoute,
    authRoute,
    relationshipsRoute
  ) => {
    const router = new express.Router();

    router.use("/profile", profileRoute);
    router.use("/account", accountRoute);
    router.use("/auth", authRoute);
    router.use("/relationships", relationshipsRoute);
    router.use("/message", messageRoute);

    return router;
  },
];
