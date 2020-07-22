const usersFactory = require("../../../src/controllers/users");
const getUsersController = usersFactory[usersFactory.length - 1];

const errorsFactory = require("../../../src/utils/error/errors");
const getErrorsController = errorsFactory[errorsFactory.length - 1];

const values = require("../../../src/utils/values");

const httpStatus = require("../../../src/utils/httpStatus");
const errors = getErrorsController(httpStatus);

const errorCodes = errors.errorCodes;
const statusCodes = httpStatus.statusCodes;

const email = "test@test.com";
const password = "password";
const userName = "test";
const name = "asdf";
const birthDate = "June, 21, 1993";
const language = "Some language";

const expectedEncryptedPassword = "encrypted password";
const expectedAccountSchema = {
  field1: "some value",
};
const expectedProfileSchema = {
  field1: "some value",
};
const expectedToken = "adfa8324adradf";
const expectedAccountId = "asd2123";
const expectedProfileId = "asdfa2132";

const expectedAccount = {
  userName,
  email,
};

const expectedProfile = {
  status: "Some status",
  statusMessage: "Some status message",
  language: "Some language",
};

const newAccount = {
  userName,
  email,
  password,
};

const newProfile = {
  name,
  birthDate,
  language,
};

const unknownError = new Error(errorCodes.UNKNOWN);
unknownError.name = errorCodes.UNKNOWN;

describe("Users controller tests", () => {
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
      return expectedAccountSchema;
    });
    accountRepository.insertToken = jest.fn();
    accountRepository.get = jest.fn(() => {
      return {
        _id: expectedAccountId,
        profile: expectedProfileId,
        ...expectedAccount,
      };
    });
    profileRepository.get = jest.fn(() => {
      return expectedProfile;
    });
    profileRepository.getSchema = jest.fn(() => {
      return expectedProfileSchema;
    });
    utils.generateToken = jest.fn(() => expectedToken);
    utils.invalid = {
      account: ["field1"],
      profile: ["field1"],
    };
    utils.isValidPassword = jest.fn(() => true);
    utils.isValid = jest.fn(() => true);

    next = jest.fn();

    controller = getUsersController(
      bcrypt,
      accountRepository,
      profileRepository,
      relationshipsRepository,
      groupsRepository,
      httpStatus,
      errors,
      utils,
      values
    );
  });

  describe("Get user", () => {
    const expectedAccountQuery = {
      _id: expectedAccountId,
    };

    const expectedAccountPojection = {
      tokens: 0,
      password: 0,
    };

    const expectedAccountOpts = {
      query: expectedAccountQuery,
      projection: expectedAccountPojection,
      lean: true,
    };

    const expectedProfileQuery = {
      _id: expectedProfileId,
    };

    const expectedProfileProjection = {
      _id: 0,
      age: 0,
      birthDate: 0,
      name: 0,
    };

    const expectedProfiletOpts = {
      query: expectedProfileQuery,
      projection: expectedProfileProjection,
      lean: true,
    };

    const req = {
      params: {
        id: expectedAccountId,
      },
    };

    let res = {
      json: jest.fn(),
    };

    beforeEach(() => {
      res = {
        json: jest.fn(),
      };
    });

    test("Should return user account", async () => {
      await controller.get(req, res, next);

      expect(accountRepository.get).toBeCalledWith(expectedAccountOpts);
      expect(profileRepository.get).toBeCalledWith(expectedProfiletOpts);
      expect(res.json).toBeCalledWith({
        id: expectedAccountId,
        account: expectedAccount,
        profile: expectedProfile,
      });
    });

    test("Should throw user not found error when user does not exist", async () => {
      const expectedError = new Error(errorCodes.USER_DOES_NOT_EXIST);
      expectedError.name = errorCodes.USER_DOES_NOT_EXIST;

      accountRepository.get = jest.fn();

      await controller.get(req, res, next);

      expect(accountRepository.get).toBeCalledWith(expectedAccountOpts);
      expect(res.json).toHaveBeenCalledTimes(0);
      expect(next).toBeCalledWith(expectedError);
    });

    test("Should handle errors", async () => {
      accountRepository.get = jest.fn(() => {
        throw unknownError;
      });

      await controller.get(req, res, next);

      expect(accountRepository.get).toBeCalledWith(expectedAccountOpts);
      expect(res.json).toHaveBeenCalledTimes(0);
      expect(next).toBeCalledWith(unknownError);
    });
  });

  describe("Create account", () => {
    const req = {
      body: { account: newAccount, profile: newProfile },
    };

    beforeEach(() => {
      accountRepository.create = jest.fn((newAccount) => ({
        ...newAccount,
        _id: expectedAccountId,
        tokens: [],
        password: expectedEncryptedPassword,
        toJSON() {
          return {
            ...newAccount,
            tokens: [],
            password: expectedEncryptedPassword,
          };
        },
      }));

      profileRepository.create = jest.fn((newProfile) => ({
        ...newProfile,
        _id: expectedProfileId,
        toJSON() {
          return { ...newProfile };
        },
      }));

      relationshipsRepository.create = jest.fn();

      groupsRepository.create = jest.fn();
    });

    test("Should create account successfully and return token given correct input", async () => {
      const expectedNewAccount = {
        ...newAccount,
        password: expectedEncryptedPassword,
      };

      const res = {
        status: jest.fn(() => {
          return res;
        }),
        json: jest.fn(() => {
          return res;
        }),
      };

      await controller.create(req, res, next);

      expect(utils.isValid).nthCalledWith(
        1,
        newProfile,
        expectedProfileSchema,
        utils.invalid.profile
      );
      expect(utils.isValid).nthCalledWith(
        2,
        newAccount,
        expectedAccountSchema,
        utils.invalid.account
      );
      expect(utils.isValidPassword).toBeCalledWith(password);
      expect(bcrypt.hash).toBeCalledWith(password, 8);
      expect(profileRepository.create).toBeCalledWith({
        ...newProfile,
        status: values.constants.STATUS_ONLINE,
      });
      expect(accountRepository.create).toBeCalledWith({
        ...expectedNewAccount,
        profile: expectedProfileId,
      });
      expect(relationshipsRepository.create).toBeCalledWith(expectedAccountId);
      expect(groupsRepository.create).toBeCalledWith(expectedAccountId);
      expect(utils.generateToken).toBeCalledWith(expectedAccountId);
      expect(accountRepository.insertToken).toBeCalledWith(
        expectedAccountId,
        expectedToken
      );
      expect(res.status).toBeCalledWith(statusCodes.CREATED);
      expect(res.json).toBeCalledWith({
        id: expectedAccountId,
        account: {
          email,
          userName,
        },
        profile: {
          ...newProfile,
          status: values.constants.STATUS_ONLINE,
        },
        token: expectedToken,
      });
      expect(next).toHaveBeenCalledTimes(0);
    });

    test("Should throw invalid object error when request contains invalid falids and handle it", async () => {
      const expectedError = new Error(errorCodes.INVALID_OBJECT);
      expectedError.name = errorCodes.INVALID_OBJECT;
      const expectedAccountSchema = {
        field1: "some value",
      };

      const res = {};

      utils.isValid = jest.fn(() => false);

      controller = getUsersController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils,
        values
      );

      await controller.create(req, res, next);
      expect(utils.isValid).toBeCalledWith(
        newAccount,
        expectedAccountSchema,
        utils.invalid.account
      );
      expect(next).toBeCalledWith(expectedError);
    });

    test("Should throw invalid password error when request contains invalid password and handle it", async () => {
      const expectedError = new Error(errorCodes.INVALID_PASSWORD);
      expectedError.name = errorCodes.INVALID_PASSWORD;

      const res = {};
      const next = jest.fn();

      utils.isValidPassword = jest.fn(() => false);

      controller = getUsersController(
        bcrypt,
        accountRepository,
        profileRepository,
        relationshipsRepository,
        groupsRepository,
        httpStatus,
        errors,
        utils,
        values
      );

      await controller.create(req, res, next);
      expect(utils.isValidPassword).toBeCalledWith(password);
      expect(next).toBeCalledWith(expectedError);
    });

    test("Should handle errors", async () => {
      const expectedNewAccount = {
        ...newAccount,
        password: expectedEncryptedPassword,
      };

      const expectedAccountSchema = {
        field1: "some value",
      };

      accountRepository.create = jest.fn(() => {
        throw unknownError;
      });

      const res = {};

      await controller.create(req, res, next);

      expect(accountRepository.create).toBeCalledWith({
        ...expectedNewAccount,
        profile: expectedProfileId,
      });
      expect(next).toBeCalledWith(unknownError);
    });
  });
});
