const express = require("express");

module.exports = [
  "profileRoute",
  "messageRoute",
  "accountRoute",
  "authRoute",
  "relationshipsRoute",
  "channelRoute",
  (
    profileRoute,
    messageRoute,
    accountRoute,
    authRoute,
    relationshipsRoute,
    channelRoute
  ) => {
    const router = new express.Router();

    router.use("/profile", profileRoute);
    router.use("/account", accountRoute);
    router.use("/auth", authRoute);
    router.use("/relationships", relationshipsRoute);
    router.use("/message", messageRoute);
    router.use("/channel", channelRoute);

    return router;
  },
];
