const express = require("express");

module.exports = [
  "msgController",
  (msgController) => {
    const router = new express.Router();

    router.post("/", msgController.newMessage);
    router.get("/get", msgController.getMessage);
    router.delete("/delete", msgController.deleteMessage);
    router.patch("/edit", msgController.editMessage);
    router.get("/getRoom", msgController.getRoom);
    router.post("/insertMany", msgController.insertMany);

    return router;
  },
];
