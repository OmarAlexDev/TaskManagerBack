const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const taskRouter = require('./controllers/tasks')
const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose');
const cors = require('cors');

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())


mongoose.connect(config.MONGODB_URL);

mongoose.connection.on('connected',()=>{
    logger.info("Connected to MongoDB")
})

mongoose.connection.on('error',(err)=>{
    logger.info("Can´t connect to MongoDB: "+err)
})

app.use(middleware.requestLogger)
app.use('/api/tasks',taskRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app


