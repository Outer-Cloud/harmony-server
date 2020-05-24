const express = require("express");

module.exports = [
  "relationshipController",
  "auth",
  (relationshipController, auth) => {
    const router = new express.Router();

    router.get("/", auth, relationshipController.getRelationships);

    router.post("/add-friend", auth, relationshipController.addFriend);

    router.put("/accept-request", auth, relationshipController.acceptRequest);
    
    router.delete("/remove-request/:id", auth, relationshipController.removeRequest);

    router.delete("/remove-friend/:id", auth, relationshipController.deleteFriend);

    router.post("/block-user", auth, relationshipController.blockUser);

    router.delete("/unblock-user/:id", auth, relationshipController.unblockUser);

    return router;
  },
];
