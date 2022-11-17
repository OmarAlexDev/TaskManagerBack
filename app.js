const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors');
const taskRouter = require('./controllers/tasks')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose');

mongoose.connect(config.MONGODB_URL);
mongoose.connection.on('connected',()=>{
    logger.info("Connected to MongoDB")
})

mongoose.connection.on('error',(err)=>{
    logger.info("Can´t connect to MongoDB: "+err)
})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/login',loginRouter)
app.use('/api/users',userRouter)
app.use('/api/tasks',middleware.extractToken,taskRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app


