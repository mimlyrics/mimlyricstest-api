/*const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const Room = require("../models/Room")
const client = new MongoClient(process.env.MONGO_URI);
const connectDB = async () => {
  try {
    const database =  client.db('mimlyrics');
    const rooms = database.collection('rooms');
    const users = database.collection('users')
    const room = await rooms.findOne({name: 'mimlyrics francais'});
    console.log(room);
    console.log("Connected to database successfully ");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}*/

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