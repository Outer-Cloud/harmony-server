const express = require("express");

module.exports = [
  "profileController",
  "auth",
  (profileController, auth) => {
    const router = new express.Router();

    router.get("/", auth, profileController.get);
    router.put("/", auth, profileController.update);

    return router;
  },
];
