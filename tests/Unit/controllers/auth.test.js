const authFactory = require("../../../src/controllers/auth");
const getAuthController = authFactory[authFactory.length - 1];

const errorsFactory = require("../../../src/utils/error/errors");
const getErrorsController = errorsFactory[errorsFactory.length - 1];

const httpStatus = require("../../../src/utils/httpStatus");
const errors = getErrorsController(httpStatus);

const errorCodes = errors.errorCodes;

const email = "test@test.com";
const password = "password";

const expectedEncryptedPassword = "encrypted password";
const expectedSchema = {
  field1: "some value",
};
const expectedToken = "adfa8324adradf";
const expectedAccountId = "asd2123";

describe("Auth Controller tests", () => {
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

    accountRepository.insertToken = jest.fn();

    utils.generateToken = jest.fn(() => expectedToken);
    utils.invalid = {
      account: ["field1"],
    };
    utils.isValidPassword = jest.fn(() => true);
    utils.isValid = jest.fn(() => true);

    next = jest.fn();

    controller = getAuthController(bcrypt, accountRepository, errors, utils);
  });

  describe("Login", () => {
    beforeEach(() => {
      bcrypt.compare = jest.fn(() => true);
      accountRepository.findByEmail = jest.fn(() => expectedAccount);

      controller = getAuthController(bcrypt, accountRepository, errors, utils);
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

      controller = getAuthController(bcrypt, accountRepository, errors, utils);

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
        },
        params: {
          token: expectedToken,
        },
      };

      const res = {
        send: jest.fn(),
      };

      const next = jest.fn();

      accountRepository.deleteTokens = jest.fn();

      await controller.logout(req, res, next);

      expect(accountRepository.deleteTokens).toBeCalledWith(
        expectedAccountId,
        expectedToken
      );

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("Should handle errors", async () => {
      const expectedError = new Error(errors.UNKNOWN);
      expectedError.name = errors.UNKNOWN;

      accountRepository.deleteTokens = jest.fn((opts) => {
        throw expectedError;
      });

      const req = { body: {}, auth: {}, params: {} };
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
        },
        params: {},
      };

      const res = {
        send: jest.fn(),
      };

      const next = jest.fn();

      accountRepository.deleteTokens = jest.fn();

      await controller.logout(req, res, next);

      expect(accountRepository.deleteTokens).toBeCalledWith(
        expectedAccountId,
        undefined
      );
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("Should handle errors", async () => {
      const expectedError = new Error(errors.UNKNOWN);
      expectedError.name = errors.UNKNOWN;

      accountRepository.deleteTokens = jest.fn(() => {
        throw expectedError;
      });

      const req = { body: {}, auth: {}, params: {} };
      const res = {};
      const next = jest.fn();

      await controller.logout(req, res, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("Check token", () => {
    afterEach(() => {
      expect(accountRepository.exists).toBeCalledWith({
        _id: expectedAccountId,
        "tokens.token": expectedToken,
      });
    });

    test("Should return true for valid token", async () => {
      accountRepository.exists = jest.fn(() => {
        return true;
      });

      const isValid = await controller.checkToken(
        expectedAccountId,
        expectedToken
      );

      expect(isValid).toEqual(true);
    });
    test("Should return false for invalid token", async () => {
      accountRepository.exists = jest.fn(() => {
        return false;
      });

      const isValid = await controller.checkToken(
        expectedAccountId,
        expectedToken
      );

      expect(isValid).toEqual(false);
    });
  });
});
