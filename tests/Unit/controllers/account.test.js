const httpStatus = require("../../../src/utils/httpStatus");
const errors = require("../../../src/utils/error/errors");

const account = require("../../../src/controllers/account");
const getController = account[account.length - 1];

describe("Account tests", () => {
  let accountRepository = {};
  let profileRespository = {};
  let relationshipsRepository = {};
  let groupsRepository = {};
  let controller = null;

  beforeEach(() => {
    accountRepository = {};
    profileRespository = {};
    relationshipsRepository = {};
    groupsRepository = {};

    controller = getController(
      accountRepository,
      profileRespository,
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
    test("Should update successfully when given valid updates", () => {

    });
    test("", () => {

    });
    test("", () => {

    });
  });

  xdescribe("Delete account", () => {
    test("", () => {});
    test("", () => {});
    test("", () => {});
  });

  xdescribe("Login", () => {
    test("", () => {});
    test("", () => {});
    test("", () => {});
  });

  xdescribe("Logout", () => {
    test("", () => {});
    test("", () => {});
    test("", () => {});
  });

  xdescribe("Logout all", () => {
    test("", () => {});
    test("", () => {});
    test("", () => {});
  });

  xdescribe("Logout all", () => {
    test("", () => {});
    test("", () => {});
    test("", () => {});
  });

  xdescribe("Check token", () => {
    test("Should return true for valid ", () => {});
    test("", () => {});
    test("", () => {});
  });
});
