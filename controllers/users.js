const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request,response)=>{
    const users = await User.find({}).populate('tasks',{content:1,responsible:1,status:1,date:1})
    response.status(201).json(users)
})

userRouter.get('/:id', async (request,response)=>{
    const user = await User.findById(request.params.id).populate('tasks',{content:1,responsible:1,status:1,date:1})
    response.status(201).json(user)
})

userRouter.post('/', async(request,response)=>{
    const {username,name,password} = request.body
    if(!(username,password)){
        return response.status(400).json({error:"Missing parameters"})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password,saltRounds)
    const newUser = new User({
        username: username,
        name: name,
        passwordHash: passwordHash
    })
    await newUser.save()
    response.status(202).json(newUser)
})

userRouter.delete('/:id', async(request,response)=>{
    const deletedUser = await User.findByIdAndDelete(request.params.id)
    response.status(204).json({message:`User with id ${request.params.id} deleted`})
})

module.exports = userRouter