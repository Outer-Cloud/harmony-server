const httpStatus = require('../utils/httpStatus');

module.exports = ['loginRepository', (loginRepository) => {

    return {

        create: async (req, res, next) => {
            try {
                const newLogin = await loginRepository.save({ newLogin: req.body });
                const token = await loginRepository.generateAuthToken(newLogin);

                res.status(httpStatus.CREATED).json(token);
            } catch (error) {
                next(error);
            }
        },

        update: async (req, res, next) => {
            try {
                await loginRepository.update({ updates: req.body, query: { _id: req.auth.id } });
                res.send();
            } catch (error) {
                next(error);
            }
        },

        delete: async (req, res, next) => {
            try {
                await loginRepository.delete({ query: { _id: req.auth.id } });
                res.status(httpStatus.NO_CONTENT).send();
            } catch (error) {
                next(error);
            }
        },

        login: async (req, res, next) => {
            try {
                const { userName, email, password } = req.body;
                const login = await loginRepository.findByCredentials(userName, email, password);
                const token = await loginRepository.generateAuthToken(login);

                res.json(token);
            } catch (error) {
                next(error);
            }
        },

        logout: async (req, res, next) => {
            try {

                const query = {
                    _id: req.auth.id,
                    'tokens.token': req.auth.token
                };

                const filter = {
                    tokens: 1
                };

                await loginRepository.deleteTokens({ query, filter });
                res.send();
            } catch (error) {
                next(error);
            }
        },

        logOutAll: async (req, res, next) => {
            try {

                const query = {
                    _id: req.auth.id,
                    'tokens.token': req.auth.token
                };

                const filter = {
                    tokens: 1
                };

                await loginRepository.deleteTokens({ query, filter, removeAll: true });
                res.send();
            } catch (error) {
                next(error);
            }
        },

        checkToken: async (id, token) => {

            const opts = {
                query: {
                    _id: id,
                    'tokens.token': token
                }
            };

            const login = loginRepository.get(opts);

            if (login && expirationDate > new Date()) {
                return true;
            }

            return false;
        }
    };
}]; 