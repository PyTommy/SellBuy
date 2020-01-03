const express = require('express');
const connectDB = require('./db/mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { handleError } = require('./middleware/error');

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
    handleError(err, res);
});

// Listening
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});

