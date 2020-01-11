const express = require('express');
const connectDB = require('./db/mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { handleError } = require('./middleware/error');
const path = require('path');

// Init app
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Connect Database
connectDB();


// Routers
app.use('/api/user', require('./routers/user'));
app.use('/api/products', require('./routers/products'));

app.use((err, req, res, next) => {
    if (err) handleError(err, res);
    next()
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

module.exports = app;