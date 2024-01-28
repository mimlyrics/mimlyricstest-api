const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Db connection successful to - ${conn.connection.host}`);
        return conn;
    }catch(error) {
        console.error(`connection failed`);
    }
}

module.exports = connectDB;