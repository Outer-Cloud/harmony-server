const _ = require('lodash');

const errors = require('../error/errors');

module.exports = ['loginModel', (loginModel) => {

    const save = async (opts) => {
        if (!isValid(opts.newLogin, loginModel.schema)) {
            throw new Error(errors.INVALID_OBJECT);
        }

        newLogin.password = await bcrypt.hash(newLogin.password, 8);
        const newLogin = new loginModel(opts.newLogin);

        await newLogin.save();

        return newLogin;
    };

    const get = async (opts) => {
        const login = await loginModel.findOne(opts.query).select(opts.projection);
        return login;
    }

    const update = async (opts) => {
        if (!isValid(opts.updates, loginModel.schema)) {
            throw new Error(errors.INVALID_UPDATES);
        }

        const updates = Object.keys(opts.updates);

        const login = await get({ query: opts.query });

        updates.forEach((update) => {
            login[update] = opts.updates[update];
        });

        if (login.isDirectModified('password')) {
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
            login.tokens = tokens.filter((token) => token.token !== query.token);
        }

        login.save();
    };

    const findByCredentials = async (email, userName, password) => {

        const query = _.pickBy({ email, userName }, (val) => val);

        const login = await get({ query });

        if (!login) {
            throw new Error(errors.LOGIN_FAILED);
        }

        const isMatch = await bcrypt.compare(password, login.password);

        if (!isMatch) {
            throw new Error(errors.LOGIN_FAILED);
        }

        return login;
    }

    const generateAuthToken = async (login) => {

        const expirationDate = new Date(new Date().getTime() + process.env.TOKEN_LIFE_TIME * 1000);

        const token = jwt.sign({ _id: login._id.toString(), profile: login.profile.toString(), expiresIn: process.env.TOKEN_LIFE_TIME }, process.env.JWT_SECRET);

        login.tokens = login.tokens.concat({ token, expirationDate });
        login.save();
        return token;
    }

    return {
        save,
        update,
        delete: deleteObj,
        findByCredentials,
        get,
        generateAuthToken,
        deleteTokens
    };
}];

