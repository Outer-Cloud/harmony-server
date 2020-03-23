const jwt = require('jsonwebtoken');

const JWT_SECRET = 'assdd3d21erfadffefgaeeva';

module.exports =  async (req, res, next) => {
    
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);

        req.token = decoded;
        next();
    } catch (err) {
        res.status(401).send('Not authorized. Please authenticate');
    }
};
