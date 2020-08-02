const _ = require("lodash");

const relationshipsFactory = require("../../../src/controllers/relationships");
const getRelationshipsController =
  relationshipsFactory[relationshipsFactory.length - 1];

const errorsFactory = require("../../../src/utils/error/errors");
const getErrorsController = errorsFactory[errorsFactory.length - 1];

const httpStatus = require("../../../src/utils/httpStatus");
const errors = getErrorsController(httpStatus);

const errorCodes = errors.errorCodes;

const values = require("../../../src/utils/values");
const { friends, blocked, pending } = values.relationshipTypes;
const { OUTBOUND_REQUEST, INBOUND_REQUEST } = values.constants;

const friendsList = [];
const blockedList = [];
const pendingList = [];

const userRelationship = {
  [friends]: friendsList,
  [blocked]: blockedList,
  [pending]: pendingList,
};

const userId = "ida2";
const targetId = "341ad";

const userRelationshipsId = "adfadf223";
const targetRelationshipsId = "dfs2tgf23";

const blockedUserId = "blocked user";
const blockingTargetRelationshipId = "target blocking user";

const blockedTargetId = "blocked target";
const blockingUserRelationshipId = "user blocking target";

const alreadyExistingFriend = "already added";

const addFriendAlreadyExistingInBound =
  "target has existing in bound, should accept request";

const outBoundRequestId = "trying to accept outbound request";

const notFoundRequestId = "not found request";

const notFriendTargetId = "Not a friend";

const toBeBlockedTargetId = "To be blocked";

const notBlockedTargetId = "not blocked";

const userDoesNotExistError = new Error(errorCodes.USER_DOES_NOT_EXIST);
userDoesNotExistError.name = errorCodes.USER_DOES_NOT_EXIST;

const requestDoesNotExistError = new Error(
  errorCodes.FRIEND_REQUEST_DOES_NOT_EXIST
);
requestDoesNotExistError.name = errorCodes.FRIEND_REQUEST_DOES_NOT_EXIST;

describe("Relationships Controller Test", () => {
  let relationshipsRepository = {};
  let controller = {};
  let res = {};
  let next = () => {};

  let req = {
    users: {
      me: {
        _id: userId,
        relationships: userRelationshipsId,
      },
      target: {
        _id: targetId,
        relationships: targetRelationshipsId,
      },
    },
  };

  beforeEach(() => {
    relationshipsRepository = {};
    relationshipsRepository.get = jest.fn((opts) => {
      const type = _.findKey(opts.projection, (value) => value === 1);
      return userRelationship[type] || {};
    });
    relationshipsRepository.removeFromRelationship = jest.fn(() => []);
    relationshipsRepository.addToRelationship = jest.fn();

    relationshipsRepository.exists = jest.fn((query) => {
      const shouldReturnTrue = {
        newRequest: {
          _id: userRelationshipsId,
          friends: { $ne: targetId },
          pending: { $not: { $elemMatch: { id: targetId } } },
        },
        addFriendExistingInBoundRequest: {
          _id: userRelationshipsId,
          pending: {
            $elemMatch: {
              id: addFriendAlreadyExistingInBound,
              type: INBOUND_REQUEST,
            },
          },
        },
        foundRequest: {
          _id: userRelationshipsId,
          pending: { $elemMatch: { id: targetId } },
        },
        toBeBlocked: {
          _id: userRelationshipsId,
          pending: { $elemMatch: { id: toBeBlockedTargetId } },
        },
        friendToRemove: {
          _id: userRelationshipsId,
          friends: targetId,
        },
        blockedByTarget: {
          _id: blockingTargetRelationshipId,
          blocked: blockedUserId,
        },
        blockedByUser: {
          _id: blockingUserRelationshipId,
          blocked: blockedTargetId,
        },
        acceptingInBoundRequest: {
          _id: userRelationshipsId,
          pending: {
            $elemMatch: { id: targetId, type: INBOUND_REQUEST },
          },
        },
      };

      if (_.some(shouldReturnTrue, (o) => _.isEqual(query, o))) {
        return true;
      }

      return false;
    });

    req = {
      users: {
        me: {
          _id: userId,
          relationships: userRelationshipsId,
        },
        target: {
          _id: targetId,
          relationships: targetRelationshipsId,
        },
      },
    };

    res = {
      send: jest.fn(),
    };

    next = jest.fn();

    controller = getRelationshipsController(
      relationshipsRepository,
      errors,
      values
    );
  });

  describe("get", () => {
    test("Should only get relationship of the given type", async () => {
      for (const type of Object.values(values.relationshipTypes)) {
        await controller.get(type)(req, res, next);

        const query = {
          _id: userRelationshipsId,
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

        expect(relationshipsRepository.get).toBeCalledWith(opts);
        expect(res.send).toBeCalledWith(userRelationship[type]);
      }
    });
  });

  describe("addFriend", () => {
    test("Should add new outbound reqest if not already a friend or on pending", async () => {
      await controller.addFriend(req, res, next);

      expect(relationshipsRepository.addToRelationship).nthCalledWith(
        1,
        userRelationshipsId,
        {
          id: targetId,
          type: OUTBOUND_REQUEST,
        },
        pending
      );
      expect(relationshipsRepository.addToRelationship).nthCalledWith(
        2,
        targetRelationshipsId,
        { id: userId, type: INBOUND_REQUEST },
        pending
      );
    });

    test("Should accept an existing inbound request instead of create new outbound request", async () => {
      req.users.target._id = addFriendAlreadyExistingInBound;
      await controller.addFriend(req, res, next);
      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        1,
        userRelationshipsId,
        {
          id: addFriendAlreadyExistingInBound,
        },
        pending
      );
      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        2,
        targetRelationshipsId,
        { id: userId },
        pending
      );

      expect(relationshipsRepository.addToRelationship).nthCalledWith(
        1,
        userRelationshipsId,
        addFriendAlreadyExistingInBound,
        friends
      );
      expect(relationshipsRepository.addToRelationship).nthCalledWith(
        2,
        targetRelationshipsId,
        userId,
        friends
      );
    });

    test("Should throw user not found if target is blocked", async () => {
      req.users.target._id = blockedTargetId;
      req.users.me.relationships = blockingUserRelationshipId;
      await controller.addFriend(req, res, next);

      expect(next).toBeCalledWith(userDoesNotExistError);
    });

    test("Should throw user not found if blocked by target", async () => {
      req.users.target.relationships = blockingTargetRelationshipId;
      req.users.me._id = blockedUserId;
      await controller.addFriend(req, res, next);

      expect(next).toBeCalledWith(userDoesNotExistError);
    });

    test("Should not add new request if target is already on friend list or pending list", async () => {
      req.users.target._id = alreadyExistingFriend;
      await controller.addFriend(req, res, next);

      expect(relationshipsRepository.addToRelationship).toHaveBeenCalledTimes(
        0
      );
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });

    test("Should not accept existing request if request type is outbound", async () => {
      req.users.target._id = alreadyExistingFriend;
      await controller.addFriend(req, res, next);

      expect(relationshipsRepository.addToRelationship).toHaveBeenCalledTimes(
        0
      );

      expect(
        relationshipsRepository.removeFromRelationship
      ).toHaveBeenCalledTimes(0);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });
  });

  describe("acceptRequest", () => {
    test("Should accept friend request if valid", async () => {
      await controller.acceptRequest(req, res, next);

      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        1,
        userRelationshipsId,
        { id: targetId },
        pending
      );
      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        2,
        targetRelationshipsId,
        { id: userId },
        pending
      );

      expect(relationshipsRepository.addToRelationship).nthCalledWith(
        1,
        userRelationshipsId,
        targetId,
        friends
      );
      expect(relationshipsRepository.addToRelationship).nthCalledWith(
        2,
        targetRelationshipsId,
        userId,
        friends
      );
    });
    test("Should throw invalid friend request error if request is not found or is an outbound request", async () => {
      req.users.target._id = outBoundRequestId;
      await controller.acceptRequest(req, res, next);

      expect(next).toBeCalledWith(requestDoesNotExistError);
    });
  });

  describe("removeRequest", () => {
    test("Should remove friend request", async () => {
      await controller.removeRequest(req, res, next);

      expect(relationshipsRepository.removeFromRelationship).toBeCalledWith(
        userRelationshipsId,
        { id: targetId },
        pending
      );

      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test("Should remove request receiving user if request is outbound request", async () => {
      relationshipsRepository.removeFromRelationship = jest.fn(() => [
        { id: targetId, type: OUTBOUND_REQUEST },
      ]);

      await controller.removeRequest(req, res, next);

      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        1,
        userRelationshipsId,
        { id: targetId },
        pending
      );
      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        2,
        targetRelationshipsId,
        { id: userId },
        pending
      );
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test("Should throw invalid friend request error if request is not found", async () => {
      req.users.target._id = notFoundRequestId;
      await controller.removeRequest(req, res, next);

      expect(next).toBeCalledWith(requestDoesNotExistError);
    });
  });

  describe("deleteFriend", () => {
    test("Should delete friend successfully", async () => {
      await controller.deleteFriend(req, res, next);

      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        1,
        userRelationshipsId,
        targetId,
        friends
      );

      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        2,
        targetRelationshipsId,
        userId,
        friends
      );
    });
    test("Should throw use does not exist error if use is not a friend", async () => {
      req.users.target._id = notFriendTargetId;
      await controller.deleteFriend(req, res, next);

      expect(next).toBeCalledWith(userDoesNotExistError);
    });
  });

  describe("blockUser", () => {
    test("Should add user to blocked", async () => {
      await controller.blockUser(req, res, next);

      expect(relationshipsRepository.addToRelationship).toBeCalledWith(
        userRelationshipsId,
        targetId,
        blocked
      );
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test("Should remove user from friends list before blocking if on it", async () => {
      await controller.blockUser(req, res, next);

      expect(relationshipsRepository.addToRelationship).toBeCalledWith(
        userRelationshipsId,
        targetId,
        blocked
      );
      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        1,
        userRelationshipsId,
        targetId,
        friends
      );
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test("Should remove user from pending list before blocking if on it", async () => {
      req.users.target._id = toBeBlockedTargetId;

      await controller.blockUser(req, res, next);

      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        1,
        userRelationshipsId,
        { id: toBeBlockedTargetId },
        pending
      );
      expect(relationshipsRepository.removeFromRelationship).nthCalledWith(
        2,
        targetRelationshipsId,
        { id: userId },
        pending
      );
    });
  });

  describe("unblockUser", () => {
    test("Should unblocked user", async () => {
      req.users.target._id = notBlockedTargetId;

      await controller.unblockUser(req, res, next);
    });

    test("Should throw user not found error if targetId is not blocked", async () => {
      req.users.target._id = blockedTargetId;
      req.users.me.relationships = blockingUserRelationshipId;

      await controller.unblockUser(req, res, next);

      expect(relationshipsRepository.removeFromRelationship).toBeCalledWith(
        blockingUserRelationshipId,
        blockedTargetId,
        blocked
      );

      expect(res.send).toHaveBeenCalledTimes(1);
    });
  });

  test.each([
    ["deleteFriend", "'self'"],
    ["addFriend", , "'self'"],
    ["blockUser", , "'self'"],
    ["unblockUser", , "'self'"],
    ["addFriend", "'null'"],
    ["blockUser", "'null'"],
  ])(
    "%s: Should throw user not found error when targetId is %s",
    async (functionToTest, targetId) => {
      req.users.target._id = targetId === "'self'" ? userId : null;

      await controller[functionToTest](req, res, next);

      expect(next).toBeCalledWith(userDoesNotExistError);
    }
  );
});
