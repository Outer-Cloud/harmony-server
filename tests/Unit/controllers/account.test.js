const accountFactory = require("../../../src/controllers/account");
const getAccountController = accountFactory[accountFactory.length - 1];

const errorsFactory = require("../../../src/utils/error/errors");
const getErrorsController = errorsFactory[errorsFactory.length - 1];

const httpStatus = require("../../../src/utils/httpStatus");
const errors = getErrorsController(httpStatus);

const errorCodes = errors.errorCodes;
const statusCodes = httpStatus.statusCodes;

const email = "test@test.com";
const password = "password";
const userName = "test";

const expectedEncryptedPassword = "encrypted password";
const expectedSchema = {
  field1: "some value",
};
const expectedToken = "adfa8324adradf";
const expectedAccountId = "asd2123";

const newAccount = {
  userName,
  email,
  password,
};

describe("Account tests", () => {
  let bcrypt = {};
  let accountRepository = {};
  let profileRepository = {};
  let relationshipsRepository = {};
  let groupsRepository = {};
  let utils = {};
  let controller = null;
  let next = jest.fn();

  beforeEach(() => {
    bcrypt = {};
    accountRepository = {};
    profileRepository = {};
    relationshipsRepository = {};
    groupsRepository = {};
    utils = {};

    bcrypt.hash = jest.fn(() => expectedEncryptedPassword);

    accountRepository.getSchema = jest.fn(() => {
      return expectedSchema;
    });
    accountRepository.insertToken = jest.fn();

    utils.generateToken = jest.fn(() => expectedToken);
    utils.invalid = {
      account: ["field1"],
    };
    utils.isValidPassword = jest.fn(() => true);
    utils.isValid = jest.fn(() => true);

    next = jest.fn();

    controller = getAccountController(
      bcrypt,
      accountRepository,
      profileRepository,
      relationshipsRepository,
      groupsRepository,
      httpStatus,
      errors,
      utils
    );
  });

  describe("Create account", () => {
    test("Should create account successfully and return token given correct input", async () => {
      const expectedNewAccount = {
        ...newAccount,
        password: expectedEncryptedPassword,
      };

      const req = {
        body: { ...newAccount },
      };

      const res = {
        status: jest.fn(() => {
          return res;
        }),
        json: jest.fn(() => {
          return res;
        }),
      };

      accountRepository.create = jest.fn((opts) => {
        return expectedAccountId;
      });

      relationshipsRepository.create = jest.fn();

      groupsRepository.create = jest.fn();

      await controller.create(req, res, next);

      expect(utils.isValidPassword).toBeCalledWith(password);
      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.account
      );
      expect(bcrypt.hash).toBeCalledWith(password, 8);
      expect(accountRepository.create).toBeCalledWith({
        newAccount: expectedNewAccount,
      });
      expect(relationshipsRepository.create).toBeCalledWith(expectedAccountId);
      expect(groupsRepository.create).toBeCalledWith(expectedAccountId);
      expect(utils.generateToken).toBeCalledWith(expectedAccountId);
      expect(accountRepository.insertToken).toBeCalledWith(
        expectedAccountId,
        expectedToken
      );
      expect(res.status).toBeCalledWith(statusCodes.CREATED);
      expect(res.json).toBeCalledWith({ token: expectedToken });
      expect(next).toHaveBeenCalledTimes(0);
    });

    test("Should throw invalid object error when request contains invalid falids and handle it", async () => {
      const expectedError = new Error(errorCodes.INVALID_OBJECT);
      expectedError.name = errorCodes.INVALID_OBJECT;
      const expectedSchema = {
        field1: "some value",
      };

      const req = {
        body: {
          ...newAccount,
        },
      };
      const res = {};

      utils.isValid = jest.fn(() => false);

      controller = getAccountController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils
      );

      await controller.create(req, res, next);
      expect(utils.isValidPassword).toBeCalledWith(password);
      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.account
      );
      expect(next).toBeCalledWith(expectedError);
    });

    test("Should throw invalid password error when request contains invalid password and handle it", async () => {
      const expectedError = new Error(errorCodes.INVALID_PASSWORD);
      expectedError.name = errorCodes.INVALID_PASSWORD;

      const req = {
        body: {
          ...newAccount,
        },
      };
      const res = {};
      const next = jest.fn();

      utils.isValidPassword = jest.fn(() => false);

      controller = getAccountController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils
      );

      await controller.create(req, res, next);
      expect(utils.isValidPassword).toBeCalledWith(password);
      expect(next).toBeCalledWith(expectedError);
    });

    test("Should handle errors", async () => {
      const expectedError = new Error(errorCodes.UNKNOWN);
      expectedError.name = errorCodes.UNKNOWN;

      const expectedNewAccount = {
        ...newAccount,
        password: expectedEncryptedPassword,
      };

      const expectedSchema = {
        field1: "some value",
      };

      accountRepository.create = jest.fn(() => {
        throw expectedError;
      });

      const req = {
        body: {
          ...newAccount,
        },
      };
      const res = {};

      await controller.create(req, res, next);
      expect(utils.isValidPassword).toBeCalledWith(password);
      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.account
      );
      expect(bcrypt.hash).toBeCalledWith(password, 8);
      expect(accountRepository.create).toBeCalledWith({
        newAccount: expectedNewAccount,
      });
      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Update account", () => {
    const expectedUpdates = {
      userName: "New user name",
      email: "New email",
    };

    const expectedUpdatesWithPassword = {
      ...expectedUpdates,
      password,
    };

    beforeEach(() => {
      accountRepository.update = jest.fn();
    });

    test("Should update successfully when given valid updates without password", async () => {
      const req = {
        body: {
          ...expectedUpdates,
        },
        auth: {},
      };
      const res = {
        send: jest.fn(),
      };

      controller = getAccountController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils
      );

      await controller.update(req, res, next);

      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.account
      );
      expect(accountRepository.update).toBeCalledWith({
        query: {},
        updates: expectedUpdates,
      });
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });

    test("Should update successfully when given valid updates with password", async () => {
      const req = {
        body: {
          ...expectedUpdatesWithPassword,
        },
        auth: {},
      };
      const res = {
        send: jest.fn(),
      };

      controller = getAccountController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils
      );

      await controller.update(req, res, next);

      expect(utils.isValidPassword).toBeCalledWith(password);
      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.account
      );
      expect(bcrypt.hash).toBeCalledWith(password, 8);
      expect(accountRepository.update).toBeCalledWith({
        query: {},
        updates: {
          ...expectedUpdates,
          password: expectedEncryptedPassword,
        },
      });
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });

    test("Should use user id from jwt", async () => {
      const expectedId = "Should be called with this";

      const req = { body: { ...expectedUpdates }, auth: { id: expectedId } };
      const res = {
        send: () => {},
      };

      utils.isValid = jest.fn(() => true);

      accountRepository.update = jest.fn((opts) => {
        expect(opts.query).toEqual({ _id: expectedId });
      });

      controller = getAccountController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils
      );

      await controller.update(req, res, next);

      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.account
      );
    });
    test("Should throw invalid update error when update contains invalid fields and handle it", async () => {
      const expectedError = new Error(errorCodes.INVALID_UPDATES);
      expectedError.name = errorCodes.INVALID_UPDATES;

      const req = { body: { ...expectedUpdates } };
      const res = {};
      const next = jest.fn();

      utils.isValid = jest.fn(() => false);

      controller = getAccountController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils
      );

      await controller.update(req, res, next);

      expect(next).toBeCalledWith(expectedError);
      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.account
      );
    });

    test("Should throw invalid update error when update contains invalid password and handle it", async () => {
      const expectedError = new Error(errorCodes.INVALID_PASSWORD);
      expectedError.name = errorCodes.INVALID_PASSWORD;

      const req = { body: { ...expectedUpdatesWithPassword } };
      const res = {};
      const next = jest.fn();

      utils.isValidPassword = jest.fn(() => false);

      controller = getAccountController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils
      );

      await controller.update(req, res, next);

      expect(next).toBeCalledWith(expectedError);
      expect(utils.isValidPassword).toBeCalledWith(password);
      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.account
      );
    });

    test("Should handle errors", async () => {
      const expectedError = new Error(errorCodes.UNKNOWN);
      expectedError.name = errorCodes.UNKNOWN;

      accountRepository.update = jest.fn((opts) => {
        throw expectedError;
      });

      const req = { body: { ...expectedUpdates }, auth: {} };
      const res = {};
      const next = jest.fn();

      utils.isValidPassword = jest.fn(() => false);
      utils.isValid = jest.fn(() => true);

      controller = getAccountController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils
      );

      await controller.update(req, res, next);

      expect(next).toBeCalledWith(expectedError);
      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.account
      );
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
      const expectedError = new Error(errorCodes.UNKNOWN);
      expectedError.name = errorCodes.UNKNOWN;

      accountRepository.delete = jest.fn((opts) => {
        throw expectedError;
      });

      const req = { body: {}, auth: {} };
      const res = {};
      const next = jest.fn();

      await controller.delete(req, res, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Login", () => {
    beforeEach(() => {
      bcrypt.compare = jest.fn(() => true);
      accountRepository.findByEmail = jest.fn(() => expectedAccount);

      controller = getAccountController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils
      );
    });

    const expectedAccount = {
      email,
      _id: expectedAccountId,
      password: expectedEncryptedPassword,
    };

    const req = {
      body: {
        email,
        password,
      },
    };

    test("Should login given correct credentials", async () => {
      const res = {
        json: jest.fn(),
      };

      await controller.login(req, res, next);

      expect(bcrypt.compare).toBeCalledWith(
        password,
        expectedEncryptedPassword
      );
      expect(accountRepository.findByEmail).toBeCalledWith(email);
      expect(accountRepository.insertToken).toBeCalledWith(
        expectedAccountId,
        expectedToken
      );
      expect(utils.generateToken).toBeCalledWith(expectedAccountId);
      expect(res.json).toBeCalledWith({ token: expectedToken });
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("Should fail login given email that doesn't exist", async () => {
      const expectedError = new Error(errorCodes.LOGIN_FAILED);
      expectedError.name = errorCodes.LOGIN_FAILED;

      const res = {};

      accountRepository.findByEmail = jest.fn(() => null);

      await controller.login(req, res, next);

      expect(accountRepository.findByEmail).toBeCalledWith(email);
      expect(utils.generateToken).toHaveBeenCalledTimes(0);
      expect(accountRepository.insertToken).toHaveBeenCalledTimes(0);
      expect(next).toBeCalledWith(expectedError);
    });
    test("Should fail login given incorrect password", async () => {
      const expectedError = new Error(errorCodes.LOGIN_FAILED);
      expectedError.name = errorCodes.LOGIN_FAILED;

      const res = {};

      bcrypt.compare = jest.fn(() => false);

      controller = getAccountController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils
      );

      await controller.login(req, res, next);

      expect(accountRepository.findByEmail).toBeCalledWith(email);
      expect(utils.generateToken).toHaveBeenCalledTimes(0);
      expect(accountRepository.insertToken).toHaveBeenCalledTimes(0);
      expect(next).toBeCalledWith(expectedError);
    });
    test("Should throw MISSING_EMAIL when email is missing", async () => {
      const expectedError = new Error(errorCodes.MISSING_EMAIL);
      expectedError.name = errorCodes.MISSING_EMAIL;

      const req = { body: {}, auth: {} };
      const res = {};
      const next = jest.fn();

      await controller.login(req, res, next);
      expect(accountRepository.findByEmail).toHaveBeenCalledTimes(0);
      expect(utils.generateToken).toHaveBeenCalledTimes(0);
      expect(accountRepository.insertToken).toHaveBeenCalledTimes(0);
      expect(next).toBeCalledWith(expectedError);
    });
    test("Should throw MISSING_PASSWORD when password is missing", async () => {
      const expectedError = new Error(errorCodes.MISSING_PASSWORD);
      expectedError.name = errorCodes.MISSING_PASSWORD;

      const req = {
        body: {
          email,
        },
        auth: {},
      };
      const res = {};
      const next = jest.fn();

      await controller.login(req, res, next);

      expect(accountRepository.findByEmail).toHaveBeenCalledTimes(0);
      expect(utils.generateToken).toHaveBeenCalledTimes(0);
      expect(accountRepository.insertToken).toHaveBeenCalledTimes(0);
      expect(next).toBeCalledWith(expectedError);
    });
    test("Should handle errors", async () => {
      const expectedError = new Error(errorCodes.UNKNOWN);
      expectedError.name = errorCodes.UNKNOWN;

      accountRepository.findByEmail = jest.fn(() => {
        throw expectedError;
      });

      const req = {
        body: {
          email,
          password,
        },
        auth: {},
      };
      const res = {};

      await controller.login(req, res, next);
      expect(accountRepository.findByEmail).toBeCalledWith(email);
      expect(utils.generateToken).toHaveBeenCalledTimes(0);
      expect(accountRepository.insertToken).toHaveBeenCalledTimes(0);
      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Logout", () => {
    test("Should log out one", async () => {
      const req = {
        auth: {
          id: expectedAccountId,
          token: expectedToken,
        },
      };

      const res = {
        send: jest.fn(),
      };

      const next = jest.fn();

      accountRepository.deleteTokens = jest.fn();

      await controller.logout(req, res, next);

      expect(accountRepository.deleteTokens).toBeCalledWith({
        query: {
          _id: expectedAccountId,
          "tokens.token": expectedToken,
        },
        filter: {
          tokens: 1,
        },
      });

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

      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Logout all", () => {
    test("Should log out every where", async () => {
      const req = {
        auth: {
          id: expectedAccountId,
          token: expectedToken,
        },
      };

      const res = {
        send: jest.fn(),
      };

      const next = jest.fn();

      accountRepository.deleteTokens = jest.fn();

      await controller.logoutAll(req, res, next);

      expect(accountRepository.deleteTokens).toBeCalledWith({
        query: {
          _id: expectedAccountId,
          "tokens.token": expectedToken,
        },
        filter: {
          tokens: 1,
        },
        removeAll: true,
      });
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("Should handle errors", async () => {
      const expectedError = new Error(errors.UNKNOWN);
      expectedError.name = errors.UNKNOWN;

      accountRepository.deleteTokens = jest.fn(() => {
        throw expectedError;
      });

      const req = { body: {}, auth: {} };
      const res = {};
      const next = jest.fn();

      await controller.logoutAll(req, res, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Check token", () => {
    afterEach(() => {
      expect(accountRepository.get).toBeCalledWith({
        query: {
          _id: expectedAccountId,
          "tokens.token": expectedToken,
        },
        lean: true,
      });
    });

    test("Should return true for valid token", async () => {
      accountRepository.get = jest.fn(() => {
        return {};
      });

      const isValid = await controller.checkToken(
        expectedAccountId,
        expectedToken
      );

      expect(isValid).toEqual(true);
    });
    test("Should return false for invalid token", async () => {
      accountRepository.get = jest.fn();

      const isValid = await controller.checkToken(
        expectedAccountId,
        expectedToken
      );

      expect(isValid).toEqual(false);
    });
  });
});
