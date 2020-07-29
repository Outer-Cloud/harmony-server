const express = require("express");

module.exports = [

  "usersRoute",
  "profileRoute",
  "messageRoute",
  "authRoute",
  "relationshipsRoute",
  (usersRoute, profileRoute, messageRoute, authRoute, relationshipsRoute) => {
    const router = new express.Router();

    router.use("/users", usersRoute);
    router.use("/profile", profileRoute);
    router.use("/auth", authRoute);
    router.use("/relationships", relationshipsRoute);
    router.use("/message", messageRoute);

    return router;
  },
];
