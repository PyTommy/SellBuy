const express = require('express');
const connectDB = require('./db/mongoose');

// Init app
const app = express();
app.use(express.json());

// Connect Database
connectDB();


// Routers
app.use('/api/user', require('./routers/user'));
app.use('/api/goods', require('./routers/goods'));


// Listening
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});

