const express = require("express");

module.exports = [
  "msgController",
  "auth",
  (msgController, auth) => {
    const router = new express.Router();

    router.post("/", auth,  msgController.newMessage);
    router.get("/get/:id", auth, msgController.getMessage);
    router.delete("/delete/:id", auth, msgController.deleteMessage);
    router.patch("/edit/:id", auth, msgController.editMessage);
    router.get("/getRoom/:room", auth, msgController.getRoom);

    return router;
  },
];
