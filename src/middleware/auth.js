const jwt = require('jsonwebtoken');
const { handleError, ErrorHandler } = require('./error');


const auth = (req, res, next) => {
    try {
    if (!req.header('Authorization')){
        throw new ErrorHandler(400, '"Authorization" header is not provided');
    }

    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        throw new ErrorHandler(400, '"No Token provided');
    }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch(err) {
        const { statusCode = 401, message = "Server Error"} = err;
        console.error(message);
        res.status(statusCode).json({
            status: "error",
            statusCode,
            message
        });
    }
};

module.exports = auth;