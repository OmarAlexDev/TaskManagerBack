const testingRouter = require('express').Router()
const User = require('../models/user')
const Task = require('../models/task')

testingRouter.post('/reset', async (request,response)=>{
    await User.deleteMany({})
    await Task.deleteMany({})
    response.status(204).end()
})

module.exports = testingRouter