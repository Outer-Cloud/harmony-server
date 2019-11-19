const jwt = require('jsonwebtoken');

const User = require('../schemas/user');

const JWT_SECRET = 'assdd3d21erfadffefgaeeva';


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send('Not authorized. Please authenticate');
    }
}

module.exports = auth;