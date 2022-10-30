require('dotenv').config()
require("./models/task")
const mongoose = require('mongoose')
const mongo_URL = process.env.MONGODB_URL

mongoose.connect(mongo_URL);

mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB")
})

mongoose.connection.on('error',(err)=>{
    console.log("Couldn´t connect to MongoDB: "+err)
})