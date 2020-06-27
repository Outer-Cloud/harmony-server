const accountFactory = require("../../../src/controllers/account");
const getAccountController = accountFactory[accountFactory.length - 1];

const errorsFactory = require("../../../src/utils/error/errors");
const getErrorsController = errorsFactory[errorsFactory.length - 1];

const httpStatus = require("../../../src/utils/httpStatus");
const errors = getErrorsController(httpStatus);

const errorCodes = errors.errorCodes;

const email = "test@test.com";
const password = "password";
const userName = "test";

const expectedEncryptedPassword = "encrypted password";
const expectedSchema = {
  field1: "some value",
};
const expectedAccount = {
  userName,
  email,
};

const expectedToken = "adfa8324adradf";
const expectedAccountId = "asd2123";

const unknownError = new Error(errorCodes.UNKNOWN);
unknownError.name = errorCodes.UNKNOWN;

describe("Account Controller tests", () => {
  let bcrypt = {};
  let _ = {};
  let accountRepository = {};
  let profileRepository = {};
  let relationshipsRepository = {};
  let groupsRepository = {};
  let utils = {};
  let controller = null;
  let next = jest.fn();

  beforeEach(() => {
    _ = {};
    bcrypt = {};
    accountRepository = {};
    profileRepository = {};
    relationshipsRepository = {};
    groupsRepository = {};
    utils = {};

    bcrypt.hash = jest.fn(() => expectedEncryptedPassword);

    accountRepository.get = jest.fn((opts) => {
      if (opts.projection.password === 0) {
        return expectedAccount;
      }

      return {
        ...expectedAccount,
        password,
      };
    });
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
      _,
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

  describe("Get account", () => {
    test("Should return user account", async () => {
      const expectedQuery = {
        _id: expectedAccountId,
      };

      const expectedPojection = {
        tokens: 0,
        password: 0,
      };

      const expectedOpts = {
        query: expectedQuery,
        projection: expectedPojection,
        lean: true,
      };

      const req = {
        auth: {
          id: expectedAccountId,
        },
      };

      const res = {
        json: jest.fn(),
      };

      await controller.get(req, res, next);

      expect(accountRepository.get).toBeCalledWith(expectedOpts);
      expect(res.json).toBeCalledWith(expectedAccount);
    });
    test("Should handle errors", async () => {
      accountRepository.get = jest.fn((opts) => {
        throw unknownError;
      });

      const expectedQuery = {
        _id: expectedAccountId,
      };

      const expectedPojection = {
        tokens: 0,
        password: 0,
      };

      const expectedOpts = {
        query: expectedQuery,
        projection: expectedPojection,
        lean: true,
      };

      const req = {
        auth: {
          id: expectedAccountId,
        },
      };

      const res = {
        json: jest.fn(),
      };

      await controller.get(req, res, next);

      expect(accountRepository.get).toBeCalledWith(expectedOpts);
      expect(res.json).toHaveBeenCalledTimes(0);
      expect(next).toBeCalledWith(unknownError);
    });
  });

  describe("Update account", () => {
    const expectedUpdates = {
      userName: "New user name",
      email: "New email",
    };

    beforeEach(() => {
      accountRepository.update = jest.fn();
    });

    test("Should update successfully when the password matches and their is changes ", async () => {
      const req = {
        body: {
          ...expectedUpdates,
          password,
        },
        auth: {},
      };
      const res = {
        send: jest.fn(),
      };

      bcrypt.compare = jest.fn(() => true);
      _.isEqual = jest.fn(() => false);
      _.isEmpty = jest.fn(() => false);

      controller = getAccountController(
        _,
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
        expectedUpdates,
        expectedSchema,
        utils.invalid.account
      );
      expect(_.isEqual).toBeCalledWith(expectedUpdates, expectedAccount);
      expect(_.isEmpty).toBeCalledWith(expectedUpdates);
      expect(bcrypt.compare).toBeCalledWith(password, password);
      expect(accountRepository.update).toBeCalledWith({
        query: {},
        updates: expectedUpdates,
      });
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });

    test("Should update password with new password successfully when old password matches", async () => {
      const req = {
        body: {
          password,
          newPassword: password,
        },
        auth: {},
      };
      const res = {
        send: jest.fn(),
      };

      utils.isValidPassword = jest.fn(() => true);
      utils.isValid = jest.fn(() => true);

      bcrypt.compare = jest.fn(() => true);
      _.isEqual = jest.fn(() => false);
      _.isEmpty = jest.fn(() => true);

      controller = getAccountController(
        _,
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
        {},
        expectedSchema,
        utils.invalid.account
      );
      expect(_.isEqual).toBeCalledWith({}, expectedAccount);
      expect(_.isEmpty).toBeCalledWith({});
      expect(bcrypt.compare).toBeCalledWith(password, password);
      expect(bcrypt.hash).toBeCalledWith(password, 8);
      expect(accountRepository.update).toBeCalledWith({
        query: {},
        updates: {
          password: expectedEncryptedPassword,
        },
      });
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });

    test("Should return 200 and perform no additional action if there are no changes and password is not changed", async () => {
      accountRepository.update = jest.fn();

      const req = {
        body: {
          ...expectedUpdates,
          password,
        },
        auth: {},
      };

      const res = {
        send: jest.fn(),
      };
      const next = jest.fn();

      _.isEqual = jest.fn(() => true);
      _.isEmpty = jest.fn(() => false);

      controller = getAccountController(
        _,
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

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(accountRepository.update).toHaveBeenCalledTimes(0);
    });

    test("Should use user id from jwt", async () => {
      const expectedId = "Should be called with this";

      const req = {
        body: { ...expectedUpdates, password },
        auth: { id: expectedId },
      };
      const res = {
        send: () => {},
      };

      utils.isValid = jest.fn(() => true);
      bcrypt.compare = jest.fn(() => true);
      _.isEqual = jest.fn(() => false);
      _.isEmpty = jest.fn(() => false);

      accountRepository.update = jest.fn((opts) => {
        expect(opts.query).toEqual({ _id: expectedId });
      });

      controller = getAccountController(
        _,
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

      expect(accountRepository.update).toBeCalledWith({
        query: { _id: expectedId },
        updates: expectedUpdates,
      });
    });

    test("Should throw password mismatch error when update contains changes and password does not match", async () => {
      const expectedError = new Error(errorCodes.PASSWORD_MISMATCH);
      expectedError.name = errorCodes.PASSWORD_MISMATCH;

      accountRepository.update = jest.fn();

      const req = {
        body: {
          ...expectedUpdates,
          password,
          newPassword: password,
        },
        auth: {},
      };

      const res = {};
      const next = jest.fn();

      _.isEqual = jest.fn(() => false);
      _.isEmpty = jest.fn(() => false);
      bcrypt.compare = jest.fn(() => false);

      controller = getAccountController(
        _,
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
      expect(bcrypt.compare).toBeCalledWith(password, password);
      expect(accountRepository.update).toHaveBeenCalledTimes(0);
    });

    test("Should throw invalid update error when update contains invalid fields and handle it", async () => {
      const expectedError = new Error(errorCodes.INVALID_UPDATES);
      expectedError.name = errorCodes.INVALID_UPDATES;

      const req = { body: { ...expectedUpdates } };
      const res = {};
      const next = jest.fn();

      utils.isValid = jest.fn(() => false);

      controller = getAccountController(
        _,
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
    });

    test("Should throw invalid update error when update contains invalid password and handle it", async () => {
      const expectedError = new Error(errorCodes.INVALID_PASSWORD);
      expectedError.name = errorCodes.INVALID_PASSWORD;

      accountRepository.update = jest.fn();

      const req = {
        body: {
          ...expectedUpdates,
          password,
          newPassword: password,
        },
        auth: {},
      };
      const res = {};
      const next = jest.fn();

      utils.isValidPassword = jest.fn(() => false);
      bcrypt.compare = jest.fn(() => true);
      _.isEqual = jest.fn(() => false);
      _.isEmpty = jest.fn(() => false);

      controller = getAccountController(
        _,
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
      expect(accountRepository.update).toHaveBeenCalledTimes(0);
    });

    test("Should handle errors", async () => {
      accountRepository.update = jest.fn((opts) => {
        throw unknownError;
      });

      const req = { body: { ...expectedUpdates, password }, auth: {} };
      const res = {};
      const next = jest.fn();

      utils.isValidPassword = jest.fn(() => false);
      utils.isValid = jest.fn(() => true);

      bcrypt.compare = jest.fn(() => true);
      _.isEqual = jest.fn(() => false);
      _.isEmpty = jest.fn(() => false);

      controller = getAccountController(
        _,
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

      expect(next).toBeCalledWith(unknownError);
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
      accountRepository.delete = jest.fn((opts) => {
        throw unknownError;
      });

      const req = { body: {}, auth: {} };
      const res = {};
      const next = jest.fn();

      await controller.delete(req, res, next);

      expect(next).toBeCalledWith(unknownError);
    });
  });
});
