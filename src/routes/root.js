const express = require("express");

module.exports = [
  "profileRoute",
  "userRoute",
  "messageRoute",
  "accountRoute",
  "authRoute",
  "relationshipRoute",
  (
    profileRoute,
    userRoute,
    messageRoute,
    accountRoute,
    authRoute,
    relationshipRoute
  ) => {
    const router = new express.Router();

    router.use("/profile", profileRoute);
    router.use("/account", accountRoute);
    router.use("/auth", authRoute);
    router.use("/relationship", relationshipRoute);
    //router.use('/users', userRoute);
    router.use("/message", messageRoute);

    return router;
  },
];
