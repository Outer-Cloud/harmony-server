const express = require("express");

module.exports = [
  "profileRoute",
  "userRoute",
  "messageRoute",
  "loginRoute",
  "relationshipRoute",
  (profileRoute, userRoute, messageRoute, loginRoute, relationshipRoute) => {
    const router = new express.Router();

    router.use("/profile", profileRoute);
    router.use("/auth", loginRoute);
    router.use("/relationship", relationshipRoute);
    //router.use('/users', userRoute);
    router.use("/message", messageRoute);

    return router;
  },
];
