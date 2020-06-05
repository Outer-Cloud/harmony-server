const httpStatus = require("../../../src/utils/httpStatus");
const errors = require("../../../src/utils/error/errors");

const account = require("../../../src/controllers/account");
const getController = account[account.length - 1];

describe("Account tests", () => {
  let accountRepository = {};
  let profileRepository = {};
  let relationshipsRepository = {};
  let groupsRepository = {};
  let controller = null;

  beforeEach(() => {
    accountRepository = {};
    profileRepository = {};
    relationshipsRepository = {};
    groupsRepository = {};

    controller = getController(
      accountRepository,
      profileRepository,
      relationshipsRepository,
      groupsRepository
    );
  });

  describe("Create account", () => {
    test("Should create account successfully and return token given correct input", async () => {
      const expectedDiscrminator = "0150";
      const expectedToken = "adfa8324adradf";
      const expectedAccountId = "asd2123";

      const expectedAccount = {
        userName: "test",
        email: "test@test.com",
        expectedDiscrminator,
        _id: expectedAccountId,
      };

      const req = {
        body: { ...expectedAccount },
      };

      const res = {
        status: jest.fn((status) => {
          return res;
        }),
        json: jest.fn((json) => {
          return res;
        }),
      };

      const next = jest.fn();

      accountRepository.create = jest.fn((opts) => {
        const { userName, email } = opts.newAccount;

        return {
          userName,
          email,
          expectedDiscrminator,
          _id: expectedAccountId,
        };
      });

      accountRepository.generateAuthToken = jest.fn((account) => expectedToken);

      relationshipsRepository.create = jest.fn((account) => {});

      groupsRepository.create = jest.fn((account) => {});

      await controller.create(req, res, next);

      expect(accountRepository.create).toHaveBeenCalledTimes(1);
      expect(accountRepository.create).toBeCalledWith({
        newAccount: expectedAccount,
      });
      expect(relationshipsRepository.create).toHaveBeenCalledTimes(1);
      expect(relationshipsRepository.create).toBeCalledWith(expectedAccountId);
      expect(groupsRepository.create).toHaveBeenCalledTimes(1);
      expect(groupsRepository.create).toBeCalledWith(expectedAccountId);
      expect(accountRepository.generateAuthToken).toHaveBeenCalledTimes(1);
      expect(accountRepository.generateAuthToken).toBeCalledWith(
        expectedAccount
      );
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toBeCalledWith(httpStatus.CREATED);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toBeCalledWith({ token: expectedToken });
      expect(next).toHaveBeenCalledTimes(0);
    });

    test("Should throw invalid object error when request contains invalid falids and handle it", async () => {
      //This test will fail until we redo validation
      const expectedError = new Error(errors.INVALID_OBJECT);
      expectedError.name = errors.INVALID_OBJECT;

      const req = { body: {} };
      const res = {};
      const next = jest.fn();

      await controller.create(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toBeCalledWith(expectedError);
    });

    test("Should handle errors", async () => {
      const expectedError = new Error(errors.UNKNOWN);
      expectedError.name = errors.UNKNOWN;

      accountRepository.create = jest.fn((opts) => {
        throw expectedError;
      });

      const req = { body: {} };
      const res = {};
      const next = jest.fn();

      await controller.create(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Update account", () => {
    test("Should update successfully when given valid updates", async () => {
      const expectedUpdates = {
        userName: "New user name",
        email: "New email",
        password: "New password",
      };

      const req = {
        body: {
          ...expectedUpdates,
        },
        auth: {},
      };
      const res = {
        send: jest.fn(),
      };
      const next = jest.fn();

      accountRepository.update = jest.fn((opts) => {
        expect(opts.updates).toEqual(expectedUpdates);
      });

      await controller.update(req, res, next);

      expect(accountRepository.update).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("Should use user id from jwt", async () => {
      const expectedId = "Should be called with this";

      const req = { body: {}, auth: { id: expectedId } };
      const res = {
        send: () => {},
      };

      const next = () => {};

      accountRepository.update = jest.fn((opts) => {
        expect(opts.query).toEqual({ _id: expectedId });
      });

      await controller.update(req, res, next);
    });
    test("Should throw invalid update error when update contains invalid fields and handle it", async () => {
      const expectedError = new Error(errors.INVALID_UPDATES);
      expectedError.name = errors.INVALID_UPDATES;

      const req = { body: {} };
      const res = {};
      const next = jest.fn();

      await controller.update(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toBeCalledWith(expectedError);
    });
    test("Should handle errors", async () => {
      const expectedError = new Error(errors.UNKNOWN);
      expectedError.name = errors.UNKNOWN;

      accountRepository.update = jest.fn((opts) => {
        throw expectedError;
      });

      const req = { body: {}, auth: {} };
      const res = {};
      const next = jest.fn();

      await controller.update(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Delete account", () => {
    test("Should delete user account and associated profile, relationships, and server list", async () => {
      const req = { body: {}, auth: {} };
      const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
      };
      const next = jest.fn();

      accountRepository.delete = jest.fn();
      profileRepository.delete = jest.fn();
      relationshipsRepository.delete = jest.fn();
      groupsRepository.delete = jest.fn();

      await controller.delete(req, res, next);

      expect(accountRepository.delete).toHaveBeenCalledTimes(1);
      expect(profileRepository.delete).toHaveBeenCalledTimes(1);
      expect(relationshipsRepository.delete).toHaveBeenCalledTimes(1);
      expect(groupsRepository.delete).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toBeCalledWith(httpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test("Should use user id from jwt", async () => {
      const expectedId = "Should be called with this";

      const req = { body: {}, auth: { id: expectedId } };
      const res = {
        status: () => res,
        send: () => {},
      };
      const next = () => {};

      accountRepository.delete = jest.fn();
      profileRepository.delete = jest.fn();
      relationshipsRepository.delete = jest.fn();
      groupsRepository.delete = jest.fn();

      await controller.delete(req, res, next);

      expect(accountRepository.delete).toBeCalledWith({
        query: { _id: expectedId },
      });
      expect(profileRepository.delete).toBeCalledWith({
        query: { account: expectedId },
      });
      expect(relationshipsRepository.delete).toBeCalledWith({
        query: { account: expectedId },
      });
      expect(groupsRepository.delete).toBeCalledWith({
        query: { account: expectedId },
      });
    });
    test("Should handle errors", async () => {
      const expectedError = new Error(errors.UNKNOWN);
      expectedError.name = errors.UNKNOWN;

      accountRepository.delete = jest.fn((opts) => {
        throw expectedError;
      });

      const req = { body: {}, auth: {} };
      const res = {};
      const next = jest.fn();

      await controller.delete(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Login", () => {
    test("Should login given correct credentials", async () => {
      const expectedEmail = "The email";
      const expectedPassword = "The password";

      const req = {
        body: {
          email: expectedEmail,
          password: expectedPassword,
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      const expectedAccount = {
        userName: expectedEmail,
        email: expectedPassword,
      };

      const expectedToken = "Token";

      accountRepository.findByCredentials = jest.fn(() => expectedAccount);
      accountRepository.generateAuthToken = jest.fn(() => expectedToken);

      await controller.login(req, res, next);

      expect(accountRepository.findByCredentials).toHaveBeenCalledTimes(1);
      expect(accountRepository.findByCredentials).toBeCalledWith(
        expectedEmail,
        expectedPassword
      );
      expect(accountRepository.generateAuthToken).toHaveBeenCalledTimes(1);
      expect(accountRepository.generateAuthToken).toBeCalledWith(
        expectedAccount
      );
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toBeCalledWith({ token: expectedToken });
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("Should handle errors", async () => {
      const expectedError = new Error(errors.UNKNOWN);
      expectedError.name = errors.UNKNOWN;

      accountRepository.findByCredentials = jest.fn((opts) => {
        throw expectedError;
      });

      const req = { body: {}, auth: {} };
      const res = {};
      const next = jest.fn();

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Logout", () => {
    test("Should log out one", async () => {
      const expectedJWT = "Aasdfasdf";
      const expectedId = "The ID";

      const req = {
        auth: {
          id: expectedId,
          token: expectedJWT,
        },
      };

      const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
      };

      const next = jest.fn();

      accountRepository.deleteTokens = jest.fn();

      await controller.logout(req, res, next);

      expect(accountRepository.deleteTokens).toHaveBeenCalledTimes(1);
      expect(accountRepository.deleteTokens).toBeCalledWith({
        query: {
          _id: expectedId,
          "tokens.token": expectedJWT,
        },
        filter: {
          tokens: 1,
        },
      });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toBeCalledWith(httpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("Should handle errors", async () => {
      const expectedError = new Error(errors.UNKNOWN);
      expectedError.name = errors.UNKNOWN;

      accountRepository.deleteTokens = jest.fn((opts) => {
        throw expectedError;
      });

      const req = { body: {}, auth: {} };
      const res = {};
      const next = jest.fn();

      await controller.logout(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Logout all", () => {
    test("Should log out every where", async () => {
      const expectedJWT = "Aasdfasdf";
      const expectedId = "The ID";

      const req = {
        auth: {
          id: expectedId,
          token: expectedJWT,
        },
      };

      const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
      };

      const next = jest.fn();

      accountRepository.deleteTokens = jest.fn();

      await controller.logoutAll(req, res, next);

      expect(accountRepository.deleteTokens).toHaveBeenCalledTimes(1);
      expect(accountRepository.deleteTokens).toBeCalledWith({
        query: {
          _id: expectedId,
          "tokens.token": expectedJWT,
        },
        filter: {
          tokens: 1,
        },
        removeAll: true,
      });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toBeCalledWith(httpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("Should handle errors", async () => {
      const expectedError = new Error(errors.UNKNOWN);
      expectedError.name = errors.UNKNOWN;

      accountRepository.deleteTokens = jest.fn((opts) => {
        throw expectedError;
      });

      const req = { body: {}, auth: {} };
      const res = {};
      const next = jest.fn();

      await controller.logoutAll(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Check token", () => {
    test("Should return true for valid token", async () => {
      const expectedId = "The ID";
      const expectedToken = "The token";

      accountRepository.get = jest.fn(() => {
        return {};
      });

      const isValid = await controller.checkToken(expectedId, expectedToken);

      expect(accountRepository.get).toHaveBeenCalledTimes(1);
      expect(accountRepository.get).toBeCalledWith({
        query: {
          _id: expectedId,
          "tokens.token": expectedToken,
        },
        lean: true,
      });
      expect(isValid).toEqual(true);
    });
    test("Should return false for invalid token", async () => {
      const expectedId = "The ID";
      const expectedToken = "The token";

      accountRepository.get = jest.fn();

      const isValid = await controller.checkToken(expectedId, expectedToken);

      expect(accountRepository.get).toHaveBeenCalledTimes(1);
      expect(accountRepository.get).toBeCalledWith({
        query: {
          _id: expectedId,
          "tokens.token": expectedToken,
        },
        lean: true,
      });
      expect(isValid).toEqual(false);
    });
  });
});
