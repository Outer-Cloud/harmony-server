const profileFactory = require("../../../src/controllers/profile");
const getProfileController = profileFactory[profileFactory.length - 1];

const errorsFactory = require("../../../src/utils/error/errors");
const getErrorsController = errorsFactory[errorsFactory.length - 1];

const httpStatus = require("../../../src/utils/httpStatus");
const errors = getErrorsController(httpStatus);

const errorCodes = errors.errorCodes;

const profileSchema = ["field1"];
const profileId = "asdfa2132";

const name = "asdf";
const birthDate = "June, 21, 1993";
const language = "Some language";
const status = "Some status";
const statusMessage = "Some status message";

const profile = {
  name,
  birthDate,
  language,
  status,
  statusMessage,
  language,
};

const unknownError = new Error(errorCodes.UNKNOWN);
unknownError.name = errorCodes.UNKNOWN;

describe("Profile Controller test", () => {
  let accountRepository = {};
  let profileRepository = {};
  let utils = {};
  let controller = {};
  let next = jest.fn();
  let res = {
    json: jest.fn(),
  };

  let req = {
    users: {
      me: {
        profile: profileId,
      },
    },
  };

  beforeEach(() => {
    utils.invalid = {
      profile: profileSchema,
    };
    utils.isValid = jest.fn(() => true);
    next = jest.fn();

    accountRepository.getField = jest.fn(() => profileId);
    profileRepository.get = jest.fn(() => {
      return { id: "adfasdf", ...profile };
    });
    profileRepository.update = jest.fn(() => ({ ...profile, _id: profileId }));
    profileRepository.getSchema = jest.fn(() => {
      return profileSchema;
    });

    res = {
      json: jest.fn(),
    };

    req = {
      users: {
        me: {
          profile: profileId,
        },
      },
    };

    controller = getProfileController(profileRepository, errors, utils);
  });

  describe("Get profile", () => {
    test("Should get profile", async () => {
      await controller.get(req, res, next);

      expect(profileRepository.get).toBeCalledWith({
        lean: {
          virtuals: true,
        },
        projection: {
          _id: 0,
        },
        query: {
          _id: profileId,
        },
      });
      expect(res.json).toBeCalledWith(profile);
      expect(next).toHaveBeenCalledTimes(0);
    });

    test("Should handle errors", async () => {
      profileRepository.get = jest.fn(() => {
        throw unknownError;
      });

      await controller.get(req, res, next);

      expect(next).toBeCalledWith(unknownError);
    });
  });
  describe("Update profile", () => {
    const updates = {
      name,
      status,
      statusMessage: "asdfa22asa",
    };

    beforeEach(() => {
      req.body = updates;
    });

    afterEach(() => {
      expect(utils.isValid).toBeCalledWith(
        updates,
        profileSchema,
        utils.invalid.profile
      );
    });

    test("Should update profile successfully", async () => {
      await controller.update(req, res, next);

      expect(profileRepository.update).toBeCalledWith({
        query: {
          _id: profileId,
        },
        updates,
      });
      expect(res.json).toBeCalledWith(profile);
      expect(next).toHaveBeenCalledTimes(0);
    });
    test("Should throw invalid object error when updates contains invalid fields", async () => {
      const expectedError = new Error(errorCodes.INVALID_UPDATES);
      expectedError.name = errorCodes.INVALID_UPDATES;

      utils.isValid = jest.fn(() => false);
      controller = getProfileController(profileRepository, errors, utils);

      await controller.update(req, res, next);

      expect(next).toBeCalledWith(expectedError);
    });
    test("Should handle errors", async () => {
      profileRepository.update = jest.fn(() => {
        throw unknownError;
      });

      await controller.update(req, res, next);

      expect(next).toBeCalledWith(unknownError);
    });
  });
});
