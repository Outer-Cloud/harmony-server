const express = require("express");

module.exports = [
  "msgController",
  "auth",
  (msgController, auth) => {
    const router = new express.Router();

    router.post("/", auth,  msgController.newMessage);
    router.get("/:id", auth, msgController.getMessage);
    router.delete("/:id", auth, msgController.deleteMessage);
    router.put("/:id", auth, msgController.editMessage);
    
    return router;
  },
];
