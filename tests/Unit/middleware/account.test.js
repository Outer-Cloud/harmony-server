const accountFactory = require("../../../src/middleware/account");
const getAccountFactory = accountFactory[accountFactory.length - 1];

const expectedAccountIdAuth = "adafddaa";
const expectedDiscriminator = "0431";
const expectedUsername = "abc";
const expectedAccountIdParams = "asdfasdfa";

const expectedUserAccount = {
  _id: expectedAccountIdAuth,
};

const expectedBodyAccount = {
  userName: expectedUsername,
  discriminator: expectedDiscriminator,
};

const expectedParamsAccount = {
  _id: expectedAccountIdParams,
};

const res = {};

describe("Attach Account Middleware Test", () => {
  let controller = {};
  let _ = {};
  let accountRepository = {};
  let opts = {
    lean: true,
  };

  let next = jest.fn();

  beforeEach(() => {
    opts = {
      lean: true,
    };

    next = jest.fn();

    _ = {};
    _.isEmpty = jest.fn(() => false);

    accountRepository = {};
    accountRepository.get = jest.fn((opts) => {
      switch (opts.query._id) {
        case expectedAccountIdAuth:
          return expectedUserAccount;
        case expectedAccountIdParams:
          return expectedParamsAccount;
        default:
          if (
            opts.query.userName === expectedUsername &&
            opts.query.discriminator === expectedDiscriminator
          ) {
            return expectedBodyAccount;
          }

          return {};
      }
    });

    controller = getAccountFactory(_, accountRepository);
  });

  test("Should attach user to req.users.me when isUser set to true", async () => {
    const middleware = controller(true);

    const req = {
      auth: {
        id: expectedAccountIdAuth,
      },
    };

    await middleware(req, res, next);

    opts.query = {
      _id: expectedAccountIdAuth,
    };

    expect(accountRepository.get).toBeCalledWith(opts);
    expect(req.users.me).toEqual(expectedUserAccount);
  });

  describe("Non-empty and attach described user", () => {
    let middleware = {};

    beforeEach(() => {
      middleware = controller();
    });

    test("Should attach user descibed in body to req.users.target when isUser set to false", async () => {
      const req = {
        params: {},
        body: {
          userName: expectedUsername,
          discriminator: expectedDiscriminator,
        },
      };

      await middleware(req, res, next);

      opts.query = {
        userName: expectedUsername,
        discriminator: expectedDiscriminator,
      };

      expect(accountRepository.get).toBeCalledWith(opts);
      expect(req.users.target).toEqual(expectedBodyAccount);
    });

    test("Should attach user descibed in params to req.users.target when isUser set to false", async () => {
      const req = {
        params: {
          id: expectedAccountIdParams,
        },
      };

      await middleware(req, res, next);

      opts.query = {
        _id: expectedAccountIdParams,
      };

      expect(accountRepository.get).toBeCalledWith(opts);
      expect(req.users.target).toEqual(expectedParamsAccount);
    });

    test("Should attach empty object to req.users.target when isUser set to false and described user in body/params not found", async () => {
      const unknownId = "unknown";

      const req = {
        params: {
          id: unknownId,
        },
      };

      await middleware(req, res, next);

      opts.query = {
        _id: unknownId,
      };

      expect(accountRepository.get).toBeCalledWith(opts);
      expect(req.users.target).toEqual({});
    });
  });

  test("Should attach empty object to req.users.target when isUser set to false and body/params are empty", async () => {
    _.isEmpty = jest.fn(() => true);
    controller = getAccountFactory(_, accountRepository);

    const middleware = controller();

    const req = {
      params: {},
      body: {},
    };

    await middleware(req, res, next);

    expect(_.isEmpty).toBeCalledWith({});
    expect(accountRepository.get).toHaveBeenCalledTimes(0);
    expect(req.users.target).toEqual({});
  });

  test("Should not override existing attached users", async () => {
    const req = {
      auth: {
        id: expectedAccountIdAuth,
      },
      params: {},
      body: {
        userName: expectedUsername,
        discriminator: expectedDiscriminator,
      },
    };

    const middlewareAttachUser = controller(true);
    const middlewareAttachTarget = controller();

    await middlewareAttachUser(req, res, next);
    await middlewareAttachTarget(req, res, next);

    const userOpts = {
      ...opts,
      query: {
        _id: expectedAccountIdAuth,
      },
    };

    const targetOpts = {
      ...opts,
      query: {
        userName: expectedUsername,
        discriminator: expectedDiscriminator,
      },
    };

    expect(accountRepository.get).nthCalledWith(1, userOpts);
    expect(accountRepository.get).nthCalledWith(2, targetOpts);
    expect(req.users.me).toEqual(expectedUserAccount);
    expect(req.users.target).toEqual(expectedBodyAccount);
  });
});
