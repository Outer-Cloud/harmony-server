const express = require("express");

module.exports = [
  "userController",
  "cert",
  (userController, cert) => {
    const router = new express.Router();

    router.get("/:id", cert, userController.getUserById);

    router.post("/add-user-dm", cert, userController.addDM);

    router.post("/add-friend-user", cert, userController.addFriend);

    return router;
  },
];
