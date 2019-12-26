const jwt = require('jsonwebtoken');


const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(400).send({msg:'No Token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).send(err);
    }
};

module.exports = auth;