const express = require("express");

module.exports = [
  "loginController",
  "auth",
  (loginController, auth) => {
    const router = new express.Router();

    router.post("/", loginController.create);
    router.put("/", auth, loginController.update);
    router.delete("/", auth, loginController.delete);
    router.post("/login", loginController.login);
    router.delete("/logout", auth, loginController.logout);
    router.delete("/logoutAll", auth, loginController.logoutAll);

    return router;
  },
];
