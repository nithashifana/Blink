const mongoose = require('mongoose');

const connectDataBase = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Database connection error:', error.message);
    }
};

module.exports = { connectDataBase };