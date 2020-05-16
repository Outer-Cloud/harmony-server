const express = require("express");

module.exports = [
  "profileController",
  "auth",
  (profileController, auth) => {
    const router = new express.Router();

    router.get("/me", auth, profileController.get);
    router.put("/me", auth, profileController.update);
    router.delete("/me", auth, profileController.delete);

    return router;
  },
];
