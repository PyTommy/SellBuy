const mongoose = require('mongoose');

const connectDB =  async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB Connected...');
    } catch(err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;