const express = require("express");

module.exports = [
  "msgController",
  "auth",
  (msgController, auth) => {
    const router = new express.Router();

    router.post("/", auth,  msgController.newMessage);
    router.get("/get", auth, msgController.getMessage);
    router.delete("/delete", auth, msgController.deleteMessage);
    router.patch("/edit", auth, msgController.editMessage);
    router.get("/getRoom", auth, msgController.getRoom);

    return router;
  },
];
