const jwt = require('jsonwebtoken');

const errors = require('../error/errors');

module.exports = ['userController', (loginController) => {
    
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const isValidToken = await loginController.checkToken(decoded._id, token);

            if (!isValidToken) {
                throw new error(errors.PLEASE_AUTHENTICATE);
            }

            req.auth.id = decoded._id;
            req.auth.profile = decoded.profile;
            req.auth.token = token;
            next();
        } catch (error) {
            next(error);
        }
    }
}];
