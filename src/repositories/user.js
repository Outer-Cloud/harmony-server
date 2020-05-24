const { isValid, filters } = require("../utils/validation");
const { OUTBOUND_REQUEST } = require("../utils/values").constants;
const errors = require("../utils/error/errors");

module.exports = [
  "userModel",
  (userModel) => {
    const get = async (opts) => {
      const user = await userModel
        .findOne(opts.query)
        .select(opts.projection)
        .lean(opts.lean);

      return user;
    };

    const removeFromPending = async (subjectId, toRemoveId) => {
      const subjectOpts = {
        query: {
          _id: subjectId,
        },
      };

      const subject = await get(subjectOpts);

      const toRemoveIndex = subject.pending.findIndex(
        (request) => request.id.toString() === toRemoveId.toString()
      );

      if (toRemoveIndex === -1) {
        const error = new Error(errors.USER_DOES_NOT_EXIST);
        error.name = errors.USER_DOES_NOT_EXIST;
        throw error;
      }

      const toRemove = subject.pending[toRemoveIndex];

      if (toRemove.type === OUTBOUND_REQUEST) {
        removeFromPending(toRemoveId, subjectId);
      }

      subject.pending.splice(toRemoveIndex, 1);

      await subject.save();
    };

    return {
      get,
      create: async (opts) => {
        const newUser = new userModel(opts.user);
        await newUser.save();

        return newUser;
      },

      update: async (opts) => {
        if (!isValid(opts.updates, userModel.schema, filters.profileUpdate)) {
          throw new Error("Invalid updates");
        }

        const updates = Object.keys(opts.updates);

        const user = await get({ query: opts.query });
        updates.forEach((update) => {
          user[update] = opts.updates[update];
        });
        await user.save();

        return user;
      },

      delete: async (opts) => {
        const user = await get({ query: opts.query });
        await user.remove();

        return user;
      },

      getUserId: async (opts) => {
        const user =
          (await get({ query: { ...opts }, projection: { _id: 1 } })) || {};
        return user._id;
      },

      addToPending: async (subjectId, toAddId, type) => {
        const subjectOpts = {
          query: {
            _id: subjectId,
            "pending.id": { $ne: toAddId },
            friends: { $ne: toAddId },
          },
        };
        const subject = await get(subjectOpts);

        if (subject) {
          subject.pending = [...subject.pending, { id: toAddId, type }];
          await subject.save();
        }
      },

      removeFromPending,

      addFriend: async (subjectId, toAddId) => {
        const subjectOpts = { query: { _id: subjectId } };
        const subject = await get(subjectOpts);

        subject.pending = subject.pending.filter(
          (request) => request.id.toString() !== toAddId.toString()
        );

        subject.friends = [...subject.friends, toAddId];
        await subject.save();
      },

      removeFriend: async (subjectId, toRemoveId) => {
        const subjectOpts = { query: { _id: subjectId } };
        const subject = await get(subjectOpts);

        subject.friends = subject.friends.filter(
          (friend) => friend.toString() !== toRemoveId.toString()
        );

        await subject.save();
      },

      blockUser: async (subjectId, toBlockId) => {
        const subjectOpts = {
          query: { _id: subjectId, blocked: { $ne: toBlockId } },
        };
        const subject = await get(subjectOpts);

        if (subject) {
          subject.blocked = [...subject.blocked, toBlockId];
          await subject.save();
        }
      },

      unblockUser: async (subjectId, toUnblockId) => {
        const subjectOpts = { query: { _id: subjectId } };
        const subject = await get(subjectOpts);

        subject.blocked = subject.blocked.filter(
          (blocked) => blocked.toString() !== toUnblockId.toString()
        );

        await subject.save();
      },

      joinServer: async (opts) => {},

      leaveServer: async (opts) => {},

      leaveDM: async (opts) => {},

      addUserToDM: async (opts) => {},
    };
  },
];
