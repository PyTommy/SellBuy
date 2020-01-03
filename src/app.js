const express = require('express');
const connectDB = require('./db/mongoose');
const cors = require('cors');
const { handleError } = require('./middleware/error');

// Init app
const app = express();
app.use(express.json());
app.use(cors());

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

