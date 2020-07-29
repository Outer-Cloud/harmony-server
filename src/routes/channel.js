const express = require("express");

module.exports = [
  "channelController",
  "auth",
  (channelController, auth) => {
    const router = new express.Router();

    router.get("/:id", auth, channelController.getChannel);
    router.delete("/:id", auth, channelController.deleteChannel);
    router.put("/:id", auth, channelController.editChannel);
    router.get("/:id/message", auth, channelController.getChannelMessage);

    return router;
  },
];
