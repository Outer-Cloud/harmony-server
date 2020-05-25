const express = require("express");

module.exports = [
  "profileRoute",
  "userRoute",
  "messageRoute",
  "accountRoute",
  "relationshipRoute",
  (profileRoute, userRoute, messageRoute, accountRoute, relationshipRoute) => {
    const router = new express.Router();

    router.use("/profile", profileRoute);
    router.use("/auth", accountRoute);
    router.use("/relationship", relationshipRoute);
    //router.use('/users', userRoute);
    router.use("/message", messageRoute);

    return router;
  },
];
