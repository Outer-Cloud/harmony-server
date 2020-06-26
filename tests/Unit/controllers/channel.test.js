const errorsFactory = require("../../../src/utils/error/errors");
const getErrorsController = errorsFactory[errorsFactory.length - 1];

const channelFactory = require("../../../src/controllers/channel");
const getMsgController = channelFactory[channelFactory.length - 1];

const httpStatus = require("../../../src/utils/httpStatus");
const errors = getErrorsController(httpStatus);

const errorCodes = errors.errorCodes;

let msgrepo = {};
let channelrepo = {};
let utils = {};

const expectedSchema = {
  field1: "some value",
};

describe("channel tests", () => {
  let next = jest.fn();

  beforeEach(() => {
    msgrepo = {};
    utils = {};
    channelrepo = {};

    utils.invalid = {
      base: ["field1"],
    };
    utils.isValid = jest.fn(() => true);
    msgrepo.getSchema = jest.fn(() => {
      return expectedSchema;
    });

    next = jest.fn();

    controller = getMsgController(msgrepo, channelrepo, utils, errors);
  });

  describe("get channel tests", () => {
    test("normal get channel", async () => {
      const userid = "account_id";
      const params = {
        id: "5dd4dcfe36424d441068faa",
      };
      const auth = {
        id: userid,
      };

      const req = {
        auth,
        params,
      };

      channelrepo.get = (opt) => {
        return opt;
      };

      const res = {
        json: (ret) => {
          expect(ret.query._id).toEqual(params.id);
        },
      };
      await controller.getChannel(req, res, next);
      expect(next).toHaveBeenCalledTimes(0);
    });

    test("get channel not exist", async () => {
      const userid = "account_id";
      const params = {
        id: "5dd4dcfe36424d441068faa",
      };
      const auth = {
        id: userid,
      };

      const req = {
        auth,
        params,
      };

      channelrepo.get = (opt) => {
        return null;
      };

      const res = {
        json: (ret) => {},
      };
      await controller.getChannel(req, res, next);
      const expectedErr = new Error(errorCodes.CHANNEL_NOT_EXIST);
      expectedErr.name = errorCodes.CHANNEL_NOT_EXIST;
      expect(next).toBeCalledWith(expectedErr);
    });
  });
  describe("delete channel tests", () => {
    test("normal delete channel", async () => {
      const userid = "account_id";
      const params = {
        id: "5dd4dcfe36424d441068faa",
      };
      const auth = {
        id: userid,
      };

      const req = {
        auth,
        params,
      };

      channelrepo.get = (opt) => {
        return opt;
      };

      channelrepo.delete = (opt) => {
        return opt;
      };

      const res = {
        json: (ret) => {
          expect(ret.query._id).toEqual(params.id);
        },
      };
      await controller.deleteChannel(req, res, next);
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("delete channel not found", async () => {
      const userid = "account_id";
      const params = {
        id: "5dd4dcfe36424d441068faa",
      };
      const auth = {
        id: userid,
      };

      const req = {
        auth,
        params,
      };

      channelrepo.get = (opt) => {
        return null;
      };

      const res = {
        json: (ret) => {},
      };
      await controller.deleteChannel(req, res, next);
      const expectedErr = new Error(errorCodes.CHANNEL_NOT_EXIST);
      expectedErr.name = errorCodes.CHANNEL_NOT_EXIST;
      expect(next).toBeCalledWith(expectedErr);
    });
    test("delete channel not allowed", async () => {
      
    });
  });
  describe("edit channel tests", () => {
    test("normal edit channel", async () => {
        const userid = "account_id";
      const params = {
        id: "5dd4dcfe36424d441068faa",
      };
      const auth = {
        id: userid,
      };

      const body = {
        name: "asdasrsdf",
        randomUpdate:"asdasdrr"
      };

      const req = {
        auth,
        params,
        body,
      };

      channelrepo.get = (opt) => {
        return opt;
      };

      channelrepo.update = (opt) => {
        return opt;
      };

      const res = {
        json: (ret) => {
          expect(ret.query._id).toEqual(params.id);
          expect(ret.updates.update).toEqual(body);
        },
      };
      await controller.editChannel(req, res, next);
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("edit channel not found", async () => {
      const userid = "account_id";
      const params = {
        id: "5dd4dcfe36424d441068faa",
      };
      const auth = {
        id: userid,
      };

      const body = {
        name: "asdasrsdf",
      };

      const req = {
        auth,
        params,
        body,
      };

      channelrepo.get = (opt) => {
        return null;
      };

      const res = {
        json: (ret) => {},
      };
      await controller.editChannel(req, res, next);
      const expectedErr = new Error(errorCodes.CHANNEL_NOT_EXIST);
      expectedErr.name = errorCodes.CHANNEL_NOT_EXIST;
      expect(next).toBeCalledWith(expectedErr);
    });
    test("edit channel not allowed", async () => {});
  });
  describe("get channel message tests", () => {
    test("normal get channel message", async () => {});
    test("get channel message not found", async () => {
      const userid = "account_id";
      const params = {
        id: "5dd4dcfe36424d441068faa",
      };
      const auth = {
        id: userid,
      };

      const req = {
        auth,
        params,
      };

      channelrepo.get = (opt) => {
        return null;
      };

      const res = {
        json: (ret) => {},
      };
      await controller.getChannelMessage(req, res, next);
      const expectedErr = new Error(errorCodes.CHANNEL_NOT_EXIST);
      expectedErr.name = errorCodes.CHANNEL_NOT_EXIST;
      expect(next).toBeCalledWith(expectedErr);
    });
  });
});
