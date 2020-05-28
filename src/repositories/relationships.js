
const { OUTBOUND_REQUEST } = require("../utils/values").constants;
const errors = require("../utils/error/errors");

module.exports = [
  "relationshipsModel",
  (relationshipsModel) => {
    const get = async (opts) => {
      const relationships = await relationshipsModel
        .findOne(opts.query)
        .select(opts.projection)
        .lean(opts.lean);

      return relationships;
    };

    const removeFromPending = async (subjectId, toRemoveId) => {
      const subjectOpts = {
        query: {
          account: subjectId,
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
      create: async (account) => {
        const newRelationships = new relationshipsModel({ account });
        await newRelationships.save();

        return newRelationships;
      },

      delete: async (opts) => {
        const relationships = await get({ query: opts.query });
        await relationships.remove();

        return relationships;
      },

      addToPending: async (subjectId, toAddId, type) => {
        const subjectOpts = {
          query: {
            account: subjectId,
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
        const subjectOpts = { query: { account: subjectId } };
        const subject = await get(subjectOpts);

        subject.pending = subject.pending.filter(
          (request) => request.id.toString() !== toAddId.toString()
        );

        subject.friends = [...subject.friends, toAddId];
        await subject.save();
      },

      removeFriend: async (subjectId, toRemoveId) => {
        const subjectOpts = { query: { account: subjectId } };
        const subject = await get(subjectOpts);

        subject.friends = subject.friends.filter(
          (friend) => friend.toString() !== toRemoveId.toString()
        );

        await subject.save();
      },

      blockUser: async (subjectId, toBlockId) => {
        const subjectOpts = {
          query: { account: subjectId, blocked: { $ne: toBlockId } },
        };
        const subject = await get(subjectOpts);

        if (subject) {
          subject.blocked = [...subject.blocked, toBlockId];
          await subject.save();
        }
      },

      unblockUser: async (subjectId, toUnblockId) => {
        const subjectOpts = { query: { account: subjectId } };
        const subject = await get(subjectOpts);

        subject.blocked = subject.blocked.filter(
          (blocked) => blocked.toString() !== toUnblockId.toString()
        );

        await subject.save();
      },
    };
  },
];
