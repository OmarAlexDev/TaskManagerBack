const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async(request,response)=>{
    const {username,name,password} = request.body
    if(!(username && password)){
        return response.status(400).json({error: "Missing parameters"})
    }

    const existingUser = await User.findOne({username:username})
    if(!(existingUser && await bcrypt.compare(password,existingUser.passwordHash))){
        return response.status(400).json({error: "Invalid credentials"})
    }

    const user = {
        username:existingUser.username,
        id: existingUser._id
    }

    const token = jwt.sign(user,config.SECRET,{expiresIn:60*60})
    response.status(200).send({token,username: existingUser.username, name: existingUser.name})
})

module.exports = loginRouter