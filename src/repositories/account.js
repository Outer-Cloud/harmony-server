module.exports = [
  "accountModel",
  "MAX_ALLOWED",
  (accountModel, MAX_ALLOWED) => {
    const create = async (opts) => {
      const randInt = Math.floor(Math.random() * MAX_ALLOWED + 1);

      const newAccount = new accountModel({
        ...opts.newAccount,
        discriminator: randInt < 1000 ? `0${randInt}` : randInt,
      });
      await newAccount.save();

      return newAccount._id;
    };

    const get = async (opts) => {
      const account = await accountModel
        .findOne(opts.query)
        .select({ __v: 0, ...opts.projection })
        .lean(opts.lean);
      return account;
    };

    const update = async (opts) => {
      const updates = Object.keys(opts.updates);

      const account = await get({ query: opts.query });

      updates.forEach((update) => {
        account[update] = opts.updates[update];
      });

      await account.save();
    };

    const deleteObj = async (opts) => {
      const account = await get({ query: opts.query });
      await account.remove();

      return account;
    };

    const deleteTokens = async (id, token) => {
      const query = {
        _id: id,
      };

      const filter = {
        tokens: 1,
      };

      const account = await get({
        query,
        filter,
      });

      if (token) {
        account.tokens = account.tokens.filter((ele) => ele.token !== token);
      } else {
        account.tokens = [];
      }

      account.save();
    };

    const getUserId = async (opts) => {
      const account =
        (await get({
          query: { ...opts },
          projection: { _id: 1 },
          lean: true,
        })) || {};
      return account._id;
    };

    const findByEmail = async (email) => {
      const query = { email };
      const account = await get({ query, lean: true });

      if (!account) {
        return null;
      }

      return account;
    };

    const insertToken = async (id, token) => {
      const account = await get({ query: { _id: id } });
      account.tokens = account.tokens.concat({ token });
      account.save();
      return token;
    };

    const getSchema = () => {
      return accountModel.schema.paths;
    };

    return {
      create,
      update,
      delete: deleteObj,
      findByEmail,
      getUserId,
      getSchema,
      get,
      insertToken,
      deleteTokens,
    };
  },
];
