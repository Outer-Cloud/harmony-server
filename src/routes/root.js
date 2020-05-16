const express = require("express");

module.exports = [
  "profileRoute",
  "userRoute",
  "messageRoute",
  "loginRoute",
  (profileRoute, userRoute, messageRoute, loginRoute) => {
    const router = new express.Router();

    router.use("/profile", profileRoute);
    router.use("/auth", loginRoute);
    //router.use('/users', userRoute);
    //router.use('/message', messageRoute);

    return router;
  },
];
