const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const errors = require("../utils/error/errors");
const { isValid, filters } = require("../utils/validation");

module.exports = [
  "loginModel",
  "JWT_SECRET",
  "TOKEN_LIFE_TIME",
  (loginModel, JWT_SECRET, TOKEN_LIFE_TIME) => {
    const create = async (opts) => {
      if (!isValid(opts.newLogin, loginModel.schema, filters.loginCreation)) {
        throw new Error(errors.INVALID_OBJECT);
      }

      const newLogin = new loginModel(opts.newLogin);
      newLogin.password = await bcrypt.hash(newLogin.password, 8);
      await newLogin.save();

      return newLogin;
    };

    const get = async (opts) => {
      const login = await loginModel
        .findOne(opts.query)
        .select(opts.projection)
        .lean(opts.lean);
      return login;
    };

    const update = async (opts) => {
      if (!isValid(opts.updates, loginModel.schema, filters.loginUpdate)) {
        throw new Error(errors.INVALID_UPDATES);
      }

      const updates = Object.keys(opts.updates);

      const login = await get({ query: opts.query });

      updates.forEach((update) => {
        login[update] = opts.updates[update];
      });

      if (login.isDirectModified("password")) {
        login.password = await bcrypt.hash(login.password, 8);
      }

      await login.save();
    };

    const deleteObj = async (opts) => {
      const login = await get({ query: opts.query });
      await login.remove();

      return login;
    };

    const deleteTokens = async (opts) => {
      const { query, filter, removeAll } = opts;
      const login = await get({ query, filter });

      if (removeAll) {
        login.tokens = [];
      } else {
        login.tokens = login.tokens.filter(
          (token) => token.token !== query["tokens.token"]
        );
      }

      login.save();
    };

    const findByCredentials = async (email, password) => {
      const query = { email };
      const login = await get({ query });

      if (!login) {
        throw new Error(errors.LOGIN_FAILED);
      }

      const isMatch = await bcrypt.compare(password, login.password);

      if (!isMatch) {
        throw new Error(errors.LOGIN_FAILED);
      }

      return login;
    };

    const generateAuthToken = async (login) => {
      const currentDate = new Date().getTime();
      const expirationDate = new Date(currentDate + TOKEN_LIFE_TIME * 1000);

      const token = jwt.sign(
        {
          _id: login._id.toString(),
          exp: expirationDate.getTime() / 1000,
          iat: currentDate / 1000,
        },
        JWT_SECRET
      );

      login.tokens = login.tokens.concat({ token });
      login.save();
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
