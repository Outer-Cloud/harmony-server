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
      relationshipsController.get(values.relationshipTypes.blocked)
    );
    router.post("/", attach, relationshipsController.blockUser);
    router.delete("/:id", attach, relationshipsController.unblockUser);

    return router;
  },
];
