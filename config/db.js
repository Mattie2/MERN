//This file initialises connection to MongoDB
//mongoose is the module used to interact with mongoDB 
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => { 
    try{
        //mongoose.connect returns a promise - using async await ensures code is clean and understandable whilst being async
        await mongoose.connect(db);
        console.log('MongoDB Connected...');
    }catch(error){
        console.error(error.message);
        // exit process with error code
        process.exit(1);
    }
}

module.exports = connectDB;