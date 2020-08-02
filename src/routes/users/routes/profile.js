const express = require("express");

module.exports = [
  "profileController",
  (profileController) => {
    const router = new express.Router();

    router.get("/", profileController.get);
    router.put("/", profileController.update);

    return router;
  },
];
