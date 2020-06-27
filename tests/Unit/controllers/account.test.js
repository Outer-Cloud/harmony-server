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
    
  })

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

      accountRepository.get = jest.fn(() => {
        return {
          ...expectedUpdates,
          password,
        };
      });

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
      expect(_.isEqual).toBeCalledWith(expectedUpdates, expectedUpdates);
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

      accountRepository.get = jest.fn(() => {
        return {
          ...expectedUpdates,
          password,
        };
      });

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
      expect(_.isEqual).toBeCalledWith({}, expectedUpdates);
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
      accountRepository.get = jest.fn(() => {
        return {
          ...expectedUpdates,
          password,
        };
      });

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

      accountRepository.get = jest.fn(() => {
        return {
          ...expectedUpdates,
          password,
        };
      });

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

      accountRepository.get = jest.fn(() => {
        return {
          ...expectedUpdates,
          password,
        };
      });

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
      expect(utils.isValid).toBeCalledWith(
        req.body,
        expectedSchema,
        utils.invalid.account
      );
    });

    test("Should throw invalid update error when update contains invalid password and handle it", async () => {
      const expectedError = new Error(errorCodes.INVALID_PASSWORD);
      expectedError.name = errorCodes.INVALID_PASSWORD;

      accountRepository.get = jest.fn(() => {
        return {
          ...expectedUpdates,
          password,
        };
      });

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
      const expectedError = new Error(errorCodes.UNKNOWN);
      expectedError.name = errorCodes.UNKNOWN;

      accountRepository.update = jest.fn((opts) => {
        throw expectedError;
      });

      accountRepository.get = jest.fn(() => {
        return {
          ...expectedUpdates,
          password,
        };
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

      expect(next).toBeCalledWith(expectedError);
      expect(utils.isValid).toBeCalledWith(
        expectedUpdates,
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
});
