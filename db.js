const mongoose = require('mongoose');
require('dotenv').config();

// const mongoURL = 'mongodb://127.0.0.1:27017/hotels' ;
const mongoURL = process.env.DBURI;
mongoose.connect(mongoURL,{
    // useNewUrlParser: true,
    // useUnifiedTopology:true
})
const db = mongoose.connection; // db is object used bridge establish intrect every where

db.on('connected', ()=>{ // connected is event lestner
    console.log("Db is connected");
})
db.on('error', ()=>{ // error is event lestner
    console.log("Db is connection error");
})

db.on('disconnected', ()=>{ // disconnected is event lestner
    console.log("Db is disconnected");
})

module.exports = db;