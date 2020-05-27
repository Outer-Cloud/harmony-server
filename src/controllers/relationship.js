const errors = require("../utils/error/errors");
const { OUTBOUND_REQUEST, INBOUND_REQUEST } = require("../utils/values").constants;

module.exports = [
  "userRepository", 
  "accountRepository",
  (userRepository, accountRepository) => {
    return {
      getRelationships: async (req, res, next) => {
        try {
          const query = {
            account: req.auth.id,
          };

          const projection = {
            friends: 1,
            blocked: 1,
            pending: 1,
            _id: 0,
          };

          const opts = {
            query,
            projection,
            lean: true,
          };

          const result = await userRepository.get(opts);

          res.send(result);
        } catch (error) {
          next(error);
        }
      },

      addFriend: async (req, res, next) => {
        try {
          const friendId = await accountRepository.getUserId(req.body);

          if (
            !friendId ||
            req.auth.id.toString() === friendId.toString()
          ) {
            const error = new Error(errors.USER_DOES_NOT_EXIST);
            error.name = errors.USER_DOES_NOT_EXIST;
            throw error;
          }

          await userRepository.addToPending(
            req.auth.id,
            friendId,
            OUTBOUND_REQUEST
          );
          await userRepository.addToPending(
            friendId,
            req.auth.id,
            INBOUND_REQUEST
          );

          res.send();
        } catch (error) {
          next(error);
        }
      },
      acceptRequest: async (req, res, next) => {
        try {
          const { _id, ...userName } = req.body;

          const friendId = _id || (await accountRepository.getUserId(userName));

          await userRepository.addFriend(req.auth.id, friendId);
          await userRepository.addFriend(friendId, req.auth.id);

          res.send();
        } catch (error) {
          next(error);
        }
      },
      removeRequest: async (req, res, next) => {
        try {
          const friendId = req.params.id;

          await userRepository.removeFromPending(req.auth.id, friendId);

          res.send();
        } catch (error) {
          next(error);
        }
      },
      deleteFriend: async (req, res, next) => {
        try {
          const friendId = req.params.id;

          await userRepository.removeFriend(req.auth.id, friendId);
          await userRepository.removeFriend(friendId, req.auth.id);

          res.send();
        } catch (error) {
          next(error);
        }
      },
      blockUser: async (req, res, next) => {
        try {
          const friendId = req.body._id;

          await userRepository.removeFriend(req.auth.id, friendId);
          await userRepository.removeFriend(friendId, req.auth.id);
          await userRepository.blockUser(req.auth.id, friendId);

          res.send();
        } catch (error) {
          next(error);
        }
      },
      unblockUser: async (req, res, next) => {
        try {
          const targetId = req.params.id;

          await userRepository.unblockUser(req.auth.id, targetId);

          res.send();
        } catch (error) {
          next(error);
        }
      },
    };
  },
];
