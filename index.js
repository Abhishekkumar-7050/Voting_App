// const { configDotenv } = require('dotenv');
const express =  require('express');
require("dotenv").config();
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const db = require('./db');




const userRoutes = require('./routes/userRoutes');

app.use('/user',userRoutes);
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/candidate',candidateRoutes);


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(" Lestening on PORT",PORT );
})