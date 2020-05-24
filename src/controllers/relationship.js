const errors = require("../utils/error/errors");
const { OUTBOUND_REQUEST, INBOUND_REQUEST } = require("../utils/values").constants;

module.exports = [
  "userRepository",
  (userRepository) => {
    return {
      getRelationships: async (req, res, next) => {
        try {
          const query = {
            _id: req.auth.profile,
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
          const friendId = await userRepository.getUserId(req.body);

          if (
            !friendId ||
            req.auth.profile.toString() === friendId.toString()
          ) {
            const error = new Error(errors.USER_DOES_NOT_EXIST);
            error.name = errors.USER_DOES_NOT_EXIST;
            throw error;
          }

          await userRepository.addToPending(
            req.auth.profile,
            friendId,
            OUTBOUND_REQUEST
          );
          await userRepository.addToPending(
            friendId,
            req.auth.profile,
            INBOUND_REQUEST
          );

          res.send();
        } catch (error) {
          console.log(error);
          next(error);
        }
      },
      acceptRequest: async (req, res, next) => {
        try {
          const { _id, ...userName } = req.body;

          const friendId = _id || (await userRepository.getUserId(userName));

          await userRepository.addFriend(req.auth.profile, friendId);
          await userRepository.addFriend(friendId, req.auth.profile);

          res.send();
        } catch (error) {
          next(error);
        }
      },
      removeRequest: async (req, res, next) => {
        try {
          const friendId = req.params.id;

          await userRepository.removeFromPending(req.auth.profile, friendId);

          res.send();
        } catch (error) {
          console.log(error);
          next(error);
        }
      },
      deleteFriend: async (req, res, next) => {
        try {
          const friendId = req.params.id;

          await userRepository.removeFriend(req.auth.profile, friendId);
          await userRepository.removeFriend(friendId, req.auth.profile);

          res.send();
        } catch (error) {
          next(error);
        }
      },
      blockUser: async (req, res, next) => {
        try {
          const friendId = req.body._id;

          await userRepository.removeFriend(req.auth.profile, friendId);
          await userRepository.removeFriend(friendId, req.auth.profile);
          await userRepository.blockUser(req.auth.profile, friendId);

          res.send();
        } catch (error) {
          next(error);
        }
      },
      unblockUser: async (req, res, next) => {
        try {
          const targetId = req.params.id;

          await userRepository.unblockUser(req.auth.profile, targetId);

          res.send();
        } catch (error) {
          console.log(error);
          next(error);
        }
      },
    };
  },
];
