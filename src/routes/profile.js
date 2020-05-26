const express = require("express");

module.exports = [
  "profileController",
  "auth",
  (profileController, auth) => {
    const router = new express.Router();

    router.post("/me", auth, profileController.create);
    router.get("/me", auth, profileController.get);
    router.put("/me", auth, profileController.update);

    return router;
  },
];
