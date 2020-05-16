const express = require("express");

module.exports = [
  "userController",
  "auth",
  (userController, auth) => {
    const router = new express.Router();

    router.post("/join-server", userController.addRelationship(req, res, next));

    router.delete(
      "/leave-server",
      userController.removeRelationship(req, res, next)
    );

    router.delete(
      "/leave-dm",
      userController.removeRelationship(req, res, next)
    );

    return router;
  },
];
