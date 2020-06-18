//todo: write tests
const errorsFactory = require("../../../src/utils/error/errors");
const getErrorsController = errorsFactory[errorsFactory.length - 1];

const msgFactory = require("../../../src/controllers/message");
const getMsgController = msgFactory[msgFactory.length - 1];

const httpStatus = require("../../../src/utils/httpStatus");
const errors = getErrorsController(httpStatus);

const errorCodes = errors.errorCodes;

let repo = {};
let utils = {};

const expectedSchema = {
  field1: "some value",
};

describe("message tests", () => {
  let next = jest.fn();

  beforeEach(() => {
    repo = {};
    utils = {};

  describe("new message tests", () => {
    test("new message normal message", async () => {
      const time = new Date(1590021724501);
      const body = {
        text: "aaaaa",
        author: "5dd4dcfe36424d441068f7aa",
        room: "5dd4dcfe36424d441068f7aa",
        isPinned: false,
        time,
        //time: 1590021724501
      };

      const req = {
        body,
      };

    test("new message normal message", async () => {
      repo.create = (opt) => {
        return opt.query.body;
      };

      const res = {
        json: (ret) => {
          expect(ret).toEqual(body);
        },
      };
      const next = (opt) => {};
      await controller.newMessage(req, res, next);
    });

    test("should throw invalid object error when new message contains invalid fields", async () => {
      const expectedError = new Error(errorCodes.INVALID_OBJECT);
      expectedError.name = errorCodes.INVALID_OBJECT;

      utils.isValid = jest.fn(() => false);
      controller = getMsgController(repo, utils, errors);

      const res = {};

      await controller.newMessage(req, res, next);

      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.base
      );
      expect(next).toBeCalledWith(expectedError);
    });

    test("new message no text", async () => {
      var hasError = false;
      body.text = "";
      const res = {
        json: () => {},
      };
      const next = (error) => {
        hasError = true;
        const err = new Error(errorCodes.MESSAGE_NO_TEXT);
        err.name = errorCodes.MESSAGE_NO_TEXT;
        expect(error).toEqual(err);
      };
      await controller.newMessage(req, res, next);
      expect(hasError).toBe(true);
    });
  });

  describe("delete message tests", () => {
    test("normal delete message", async () => {
      const params = {
        id: "5dd4dcfe36424d441068f7aa",
      };
      const req = {
        params,
      };
      const res = {
        json: (ret) => {
          expect(ret._id).toEqual(params.id);
        },
      };
      repo.get = (opt) => {
        return {
          _id: params.id,
        };
      };

      repo.delete = (opt) => {
        return opt.query.body;
      };
      const next = (opt) => {};
      await controller.deleteMessage(req, res, next);
    });

    test("delete message not found", async () => {
      var hasError = false;
      const params = {
        ID: "5dd4dcfe36424d441068faa",
      };
      const userID = "USER_IDID";
      const auth = {
        id: userID,
      };
      const req = {
        params,
        auth,
      };
      repo.get = (opt) => {
        return null;
      };
      const res = {
        json: (ret) => {},
      };
      const next = (error) => {
        hasError = true;
        const err = new Error(errorCodes.MESSAGE_NOT_EXIST);
        err.name = errorCodes.MESSAGE_NOT_EXIST;
        expect(error).toEqual(err);
      };
      await controller.deleteMessage(req, res, next);
      expect(hasError).toBe(true);
    });

    test("delete message not allowed", async () => {
      var hasError = false;
      const params = {
        id: "5dd4dcfe36424d441068faa",
      };
      const userID = "USER_IDID";
      const auth = {
        id: userID,
      };
      const req = {
        params,
        auth,
      };
      repo.get = (opt) => {
        return {
          _id: params.id,
          author: "asdfsadfwerqsd",
        };
      };
      const res = {
        json: (ret) => {},
      };
      const next = (error) => {
        hasError = true;
        const err = new Error(errorCodes.MESSAGE_AUTHOR_ID_MISMATCH);
        err.name = errorCodes.MESSAGE_AUTHOR_ID_MISMATCH;
        expect(error).toEqual(err);
      };
      await controller.deleteMessage(req, res, next);
      expect(hasError).toBe(true);
    });
  });

  describe("edit message tests", () => {
    test("normal edit message", async () => {
      const body = {
        text: "sdfw",
      };
      const params = {
        id: "5dd4dcfe36424d441068f7aa",
      };
      const userID = "USER_IDID";
      const auth = {
        id: userID,
      };
      const req = {
        params,
        body,
        auth,
      };

      repo.get = (opt) => {
        return {
          _id: params.id,
          author: userID,
        };
      };

      repo.update = (opt) => {
        return opt;
      };

      const res = {
        json: (ret) => {
          expect(ret.query._id).toEqual(params.id);
          expect(ret.update.text).toEqual(body.text);
        },
      };
      const next = jest.fn(() => {});
      await functions.editMessage(req, res, next);
      expect(next).toBeCalledTimes(0);
    });

    test("edit message not found", async () => {
      var hasError = false;
      const params = {
        id: "5dd4dcfe36424d441068faa",
      };
      const body = {
        text: "test test",
      };
      const userID = "USER_IDID";
      const auth = {
        id: userID,
      };
      const req = {
        params,
        body,
        auth,
      };
      const res = {
        json: (ret) => {},
      };
      repo.get = (opt) => {
        return null;
      };
      const next = (error) => {
        hasError = true;
        const err = new Error(errorCodes.MESSAGE_NOT_EXIST);
        err.name = errorCodes.MESSAGE_NOT_EXIST;
        expect(error).toEqual(err);
      };
      await controller.editMessage(req, res, next);
      expect(hasError).toBe(true);
    });

    test("edit message no text", async () => {
      var hasError = false;
      const body = {
        ID: "5dd4dcfe36424d441068f7aa",
        text: "",
      };
      const params = {
        id: "5dd4dcfe36424d441068f7aa",
      };
      const userID = "USER_IDID";
      const auth = {
        id: userID,
      };
      const req = {
        params,
        body,
        auth,
      };

      repo.get = (opt) => {
        return {
          _id: body.ID,
          author: userID,
        };
      };

      const res = {
        json: (ret) => {},
      };
      const next = (error) => {
        hasError = true;
        const err = new Error(errorCodes.MESSAGE_NO_TEXT);
        err.name = errorCodes.MESSAGE_NO_TEXT;
        expect(error).toEqual(err);
      };
      await controller.editMessage(req, res, next);
      expect(hasError).toBe(true);
    });

    test("edit message not allowed", async () => {
      var hasError = false;
      const body = {
        text: "5dd4dcfe36424dajsdfhkjwehar441068faa",
      };
      const params = {
        id: "5dd4dcfe36424d441068f7aa",
      };
      const userID = "USER_IDID";
      const auth = {
        id: userID,
      };
      const req = {
        params,
        body,
        auth,
      };

      repo.get = (opt) => {
        return {
          _id: body.ID,
          author: "SomeRandomOtherDude",
        };
      };

      const res = {
        json: (ret) => {},
      };
      const next = (error) => {
        hasError = true;
        const err = new Error(errorCodes.MESSAGE_AUTHOR_ID_MISMATCH);
        err.name = errorCodes.MESSAGE_AUTHOR_ID_MISMATCH;
        expect(error).toEqual(err);
      };
      await controller.editMessage(req, res, next);
      expect(hasError).toBe(true);
    });
  });

  describe("get message tests", () => {
    test("normal get message", async () => {
      const params = {
        id: "5dd4dcfe36424d441068f7aa",
      };
      const userID = "USER_IDID";
      const auth = {
        id: userID,
      };
      const req = {
        params,
        auth,
      };
      repo.get = (opt) => {
        return {
          _id: params.id,
          author: userID,
        };
      };
      const res = {
        json: (ret) => {
          expect(ret._id).toEqual(params.id);
        },
      };
      const next = (error) => {};
      await controller.getMessage(req, res, next);
    });

    test("get message not found", async () => {
      var hasError = false;
      const params = {
        id: "5dd4dcfe36424d441068faa",
      };
      const userID = "USER_IDID";
      const auth = {
        id: userID,
      };
      const req = {
        params,
        auth,
      };

      repo.get = (opt) => {
        return null;
      };

      const res = {
        json: (ret) => {},
      };
      const next = (error) => {
        hasError = true;
        const err = new Error(errorCodes.MESSAGE_NOT_EXIST);
        err.name = errorCodes.MESSAGE_NOT_EXIST;
        expect(error).toEqual(err);
      };
      await controller.getMessage(req, res, next);
      expect(hasError).toBe(true);
    });
  });
});
