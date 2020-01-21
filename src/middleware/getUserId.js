const jwt = require('jsonwebtoken');
const { handleError, ErrorHandler } = require('./error');


const auth = (req, res, next) => {
    try {
        if (!req.header('Authorization')) {
            return next();
        }

        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        next();
    } catch (err) {
        const { statusCode = 401, message = "Server Error" } = err;
        console.error(message);
        res.status(statusCode).json({
            status: "error",
            statusCode,
            message
        });
    }
};

module.exports = auth;