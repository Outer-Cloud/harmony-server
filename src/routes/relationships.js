const express = require("express");

module.exports = [
  "relationshipsController",
  "auth",
  (relationshipsController, auth) => {
    const router = new express.Router();

    router.get("/", auth, relationshipsController.getRelationships);

    router.post("/add-friend", auth, relationshipsController.addFriend);

    router.put("/accept-request", auth, relationshipsController.acceptRequest);

    router.delete(
      "/remove-request/:id",
      auth,
      relationshipsController.removeRequest
    );

    router.delete(
      "/remove-friend/:id",
      auth,
      relationshipsController.deleteFriend
    );

    router.post("/block-user", auth, relationshipsController.blockUser);

    router.delete(
      "/unblock-user/:id",
      auth,
      relationshipsController.unblockUser
    );

    return router;
  },
];
