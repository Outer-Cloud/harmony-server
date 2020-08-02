const express = require("express");

module.exports = [
  "attachUser",
  "relationshipsController",
  "values",
  (attachUser, relationshipsController, values) => {
    const router = new express.Router();
    const attach = attachUser();

    router.get(
      "/",
      attach,
      relationshipsController.get(values.relationshipTypes.pending)
    );
    router.post("/", attach, relationshipsController.addFriend);

    const actionRoute = new express.Router({ mergeParams: true });

    actionRoute.delete("/decline", relationshipsController.removeRequest);
    actionRoute.delete("/accept", relationshipsController.acceptRequest);

    router.use("/:id", attach, actionRoute);

    return router;
  },
];
