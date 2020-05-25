const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const errors = require("../utils/error/errors");
const { isValid, filters } = require("../utils/validation");

module.exports = [
  "accountModel",
  "JWT_SECRET",
  "TOKEN_LIFE_TIME",
  (accountModel, JWT_SECRET, TOKEN_LIFE_TIME) => {
    const create = async (opts) => {
      if (!isValid(opts.newAccount, accountModel.schema, filters.accountCreation)) {
        throw new Error(errors.INVALID_OBJECT);
      }

      const newAccount = new accountModel(opts.newAccount);
      newAccount.password = await bcrypt.hash(newAccount.password, 8);
      await newAccount.save();

      return newAccount;
    };

    const get = async (opts) => {
      const account = await accountModel
        .findOne(opts.query)
        .select(opts.projection)
        .lean(opts.lean);
      return account;
    };

    const update = async (opts) => {
      if (!isValid(opts.updates, accountModel.schema, filters.accountUpdate)) {
        throw new Error(errors.INVALID_UPDATES);
      }

      const updates = Object.keys(opts.updates);

      const account = await get({ query: opts.query });

      updates.forEach((update) => {
        account[update] = opts.updates[update];
      });

      if (account.isDirectModified("password")) {
        account.password = await bcrypt.hash(account.password, 8);
      }

      await account.save();
    };

    const deleteObj = async (opts) => {
      const account = await get({ query: opts.query });
      await account.remove();

      return account;
    };

    const deleteTokens = async (opts) => {
      const { query, filter, removeAll } = opts;
      const account = await get({ query, filter });

      if (removeAll) {
        account.tokens = [];
      } else {
        account.tokens = account.tokens.filter(
          (token) => token.token !== query["tokens.token"]
        );
      }

      account.save();
    };

    const findByCredentials = async (email, password) => {
      const query = { email };
      const account = await get({ query });

      if (!account) {
        throw new Error(errors.LOGIN_FAILED);
      }

      const isMatch = await bcrypt.compare(password, account.password);

      if (!isMatch) {
        throw new Error(errors.LOGIN_FAILED);
      }

      return account;
    };

    const generateAuthToken = async (account) => {
      const currentDate = new Date().getTime();
      const expirationDate = new Date(currentDate + TOKEN_LIFE_TIME * 1000);

      const token = jwt.sign(
        {
          _id: account._id.toString(),
          exp: expirationDate.getTime() / 1000,
          iat: currentDate / 1000,
        },
        JWT_SECRET
      );

      account.tokens = account.tokens.concat({ token });
      account.save();
      return token;
    };

    return {
      create,
      update,
      delete: deleteObj,
      findByCredentials,
      get,
      generateAuthToken,
      deleteTokens,
    };
  },
];
