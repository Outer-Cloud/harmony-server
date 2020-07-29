module.exports = [
  "relationshipsRepository",
  "errors",
  "values",
  (relationshipsRepository, errors, values) => {
    const errorCodes = errors.errorCodes;
    const { OUTBOUND_REQUEST, INBOUND_REQUEST } = values.constants;
    const { friends, blocked, pending } = values.relationshipTypes;

    return {
      get: (type) => async (req, res, next) => {
        try {
          const relationshipsId = req.users.me.relationships;

          const query = {
            _id: relationshipsId,
          };

          const projection = {
            [type]: 1,
            _id: 0,
          };

          const opts = {
            query,
            projection,
            lean: true,
          };

          const result = await relationshipsRepository.get(opts);

          res.send(result);
        } catch (error) {
          next(error);
        }
      },

      addFriend: async (req, res, next) => {
        try {
          const userId = req.users.me._id;
          const userRelationshipsId = req.users.me.relationships;

          const targetId = req.users.target._id;
          const targetRelationshipsId = req.users.target.relationships;

          const isUserBlockedByTarget = await relationshipsRepository.exists({
            _id: targetRelationshipsId,
            blocked: userId,
          });

          const isTargetBlocked = await relationshipsRepository.exists({
            _id: userRelationshipsId,
            blocked: targetId,
          });

          if (
            !targetId ||
            userId === targetId ||
            isUserBlockedByTarget ||
            isTargetBlocked
          ) {
            const error = new Error(errorCodes.USER_DOES_NOT_EXIST);
            error.name = errorCodes.USER_DOES_NOT_EXIST;
            throw error;
          }

          const shouldAdd = await relationshipsRepository.exists({
            _id: userRelationshipsId,
            friends: { $ne: targetId },
          });

          if (shouldAdd) {
            await relationshipsRepository.addToRelationship(
              userRelationshipsId,
              {
                id: targetId,
                type: OUTBOUND_REQUEST,
              },
              pending
            );
            await relationshipsRepository.addToRelationship(
              targetRelationshipsId,
              { id: userId, type: INBOUND_REQUEST },
              pending
            );
          }

          res.send();
        } catch (error) {
          next(error);
        }
      },
      acceptRequest: async (req, res, next) => {
        try {
          const userId = req.users.me._id;
          const userRelationshipsId = req.users.me.relationships;

          const targetId = req.users.target._id;
          const targetRelationshipsId = req.users.target.relationships;

          const isValidRequest = await relationshipsRepository.exists({
            _id: userRelationshipsId,
            pending: { $elemMatch: { id: targetId, type: INBOUND_REQUEST } },
          });

          if (!isValidRequest) {
            const error = new Error(errorCodes.FRIEND_REQUEST_DOES_NOT_EXIST);
            error.name = errorCodes.FRIEND_REQUEST_DOES_NOT_EXIST;
            throw error;
          }

          await relationshipsRepository.removeFromRelationship(
            userRelationshipsId,
            { id: targetId },
            pending
          );
          await relationshipsRepository.removeFromRelationship(
            targetRelationshipsId,
            { id: userId },
            pending
          );

          await relationshipsRepository.addToRelationship(
            userRelationshipsId,
            targetId,
            friends
          );
          await relationshipsRepository.addToRelationship(
            targetRelationshipsId,
            userId,
            friends
          );

          res.send();
        } catch (error) {
          next(error);
        }
      },
      removeRequest: async (req, res, next) => {
        try {
          const userId = req.users.me._id;
          const userRelationshipsId = req.users.me.relationships;

          const targetId = req.users.target._id;
          const targetRelationshipsId = req.users.target.relationships;

          const isValidRequest = await relationshipsRepository.exists({
            _id: userRelationshipsId,
            pending: { $elemMatch: { id: targetId } },
          });

          if (!isValidRequest) {
            const error = new Error(errorCodes.FRIEND_REQUEST_DOES_NOT_EXIST);
            error.name = errorCodes.FRIEND_REQUEST_DOES_NOT_EXIST;
            throw error;
          }

          const result = await relationshipsRepository.removeFromRelationship(
            userRelationshipsId,
            { id: targetId },
            pending
          );

          const old = result.find(
            (request) => request.id.toString() === targetId
          );

          if (old.type === OUTBOUND_REQUEST) {
            await relationshipsRepository.removeFromRelationship(
              targetRelationshipsId,
              { id: userId },
              pending
            );
          }

          res.send();
        } catch (error) {
          next(error);
        }
      },
      deleteFriend: async (req, res, next) => {
        try {
          const userId = req.users.me._id;
          const userRelationshipsId = req.users.me.relationships;

          const targetId = req.users.target._id;
          const targetRelationshipsId = req.users.target.relationships;

          const isFriend = await relationshipsRepository.exists({
            _id: userRelationshipsId,
            friends: targetId,
          });

          if (!isFriend) {
            const error = new Error(errorCodes.USER_DOES_NOT_EXIST);
            error.name = errorCodes.USER_DOES_NOT_EXIST;
            throw error;
          }

          await relationshipsRepository.removeFromRelationship(
            userRelationshipsId,
            targetId,
            friends
          );

          await relationshipsRepository.removeFromRelationship(
            targetRelationshipsId,
            userId,
            friends
          );

          res.send();
        } catch (error) {
          next(error);
        }
      },
      blockUser: async (req, res, next) => {
        try {
          const userId = req.users.me._id;
          const userRelationshipsId = req.users.me.relationships;

          const targetId = req.users.target._id;
          const targetRelationshipsId = req.users.target.relationships;

          if (!targetId) {
            const error = new Error(errorCodes.USER_DOES_NOT_EXIST);
            error.name = errorCodes.USER_DOES_NOT_EXIST;
            throw error;
          }

          const isFriend = await relationshipsRepository.exists({
            _id: userRelationshipsId,
            friends: targetId,
          });

          const isPending = await relationshipsRepository.exists({
            _id: userRelationshipsId,
            pending: { $elemMatch: { id: targetId } },
          });

          if (isFriend) {
            await relationshipsRepository.removeFromRelationship(
              userRelationshipsId,
              targetId,
              friends
            );

            await relationshipsRepository.removeFromRelationship(
              targetRelationshipsId,
              userId,
              friends
            );
          } else if (isPending) {
            await relationshipsRepository.removeFromRelationship(
              userRelationshipsId,
              { id: targetId },
              pending
            );
            await relationshipsRepository.removeFromRelationship(
              targetRelationshipsId,
              { id: userId },
              pending
            );
          }

          await relationshipsRepository.addToRelationship(
            userRelationshipsId,
            targetId,
            blocked
          );

          res.send();
        } catch (error) {
          next(error);
        }
      },
      unblockUser: async (req, res, next) => {
        try {
          const userRelationshipsId = req.users.me.relationships;

          const targetId = req.users.target._id;

          await relationshipsRepository.removeFromRelationship(
            userRelationshipsId,
            targetId,
            blocked
          );

          res.send();
        } catch (error) {
          next(error);
        }
      },
    };
  },
];
