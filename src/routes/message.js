const express = require("express");

module.exports = [
  "msgController",
  "auth",
  (msgController, auth) => {
    const router = new express.Router();

    router.post("/",  msgController.newMessage);
    router.get("/get",  msgController.getMessage);
    router.delete("/delete",  msgController.deleteMessage);
    router.patch("/edit",  msgController.editMessage);
    router.get("/getRoom",  msgController.getRoom);

    return router;
  },
];
