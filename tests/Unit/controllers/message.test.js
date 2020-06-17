//todo: write tests
const errors = require("../../../src/utils/error/errors");
const controller = require("../../../src/controllers/message");
let repo = {};
let functions = controller[1](repo);

describe("message tests", () => {
  beforeEach(() => {
    repo = {};
    functions = controller[1](repo);
  });

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

      repo.create = (opt) => {
        return opt.query.body;
      };

      const res = {
        json: (ret) => {
          expect(ret).toEqual(body);
        },
      };
      const next = (opt) => {};
      await functions.newMessage(req, res, next);
    });

    test("new message no text", async () => {
      var hasError = false;
      const time = new Date(1590021724501);
      const body = {
        text: "",
        author: "5dd4dcfe36424d441068f7aa",
        room: "5dd4dcfe36424d441068f7aa",
        isPinned: false,
        time,
        //time: 1590021724501
      };
      const req = {
        body,
      };

      const res = {
        json: (ret) => {},
      };
      const next = (error) => {
        hasError = true;
        const err = new Error(errors.MESSAGE_NO_TEXT);
        err.name = errors.MESSAGE_NO_TEXT;
        expect(error).toEqual(err);
      };
      await functions.newMessage(req, res, next);
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
      await functions.deleteMessage(req, res, next);
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
        const err = new Error(errors.MESSAGE_NOT_EXIST);
        err.name = errors.MESSAGE_NOT_EXIST;
        expect(error).toEqual(err);
      };
      await functions.deleteMessage(req, res, next);
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
        const err = new Error(errors.MESSAGE_AUTHOR_ID_MISMATCH);
        err.name = errors.MESSAGE_AUTHOR_ID_MISMATCH;
        expect(error).toEqual(err);
      };
      await functions.deleteMessage(req, res, next);
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
        const err = new Error(errors.MESSAGE_NOT_EXIST);
        err.name = errors.MESSAGE_NOT_EXIST;
        expect(error).toEqual(err);
      };
      await functions.editMessage(req, res, next);
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
        const err = new Error(errors.MESSAGE_NO_TEXT);
        err.name = errors.MESSAGE_NO_TEXT;
        expect(error).toEqual(err);
      };
      await functions.editMessage(req, res, next);
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
        const err = new Error(errors.MESSAGE_AUTHOR_ID_MISMATCH);
        err.name = errors.MESSAGE_AUTHOR_ID_MISMATCH;
        expect(error).toEqual(err);
      };
      await functions.editMessage(req, res, next);
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
      await functions.getMessage(req, res, next);
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
        const err = new Error(errors.MESSAGE_NOT_EXIST);
        err.name = errors.MESSAGE_NOT_EXIST;
        expect(error).toEqual(err);
      };
      await functions.getMessage(req, res, next);
      expect(hasError).toBe(true);
    });
  });
});
