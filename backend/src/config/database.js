const mongoose = require("mongoose");
require('dotenv').config();
const admin = process.env.MONGODB_ADMIN;
const password = process.env.MONGODB_PASSWORD;


const connectDB = async () => {
    mongoose.connect(`mongodb+srv://${admin}:${password}@personal.mldib.mongodb.net/romdev`);
}

module.exports = connectDB;