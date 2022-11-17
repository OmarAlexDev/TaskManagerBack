const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')
const User = require('../models/user')
const taskRouter = require('express').Router()

taskRouter.get("/", async (req,res)=>{
    const result = await Task.find({})
    res.json(result)
})

taskRouter.get("/:id", async (req,res)=>{
    const result = await Task.findById(req.params.id)
    if(result){
        res.json(result)
    }else{
        res.status(404).end()
    }
})

taskRouter.put("/:id", async(req,res)=>{
    const result = await Task.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true})
    res.status(201).json(result)
})

taskRouter.post("/", async (req,res)=>{
    const {content,responsible} = req.body
    const decodedToken = jwt.verify(req.token,config.SECRET)
    if((content&&responsible)!=undefined){
        const parentUser = await User.findById(decodedToken.id)
        const task = new Task({
            "content": content,
            "responsible": responsible,
            "user": parentUser._id
        })
        const result = await task.save()
        parentUser.tasks = parentUser.tasks.concat(result._id)
        await parentUser.save()
        res.status(201).json(result)
          
    }else{
        res.status(400).json({ 
            error: 'content missing' 
        })
    }
})

taskRouter.delete("/:id", async (req,res)=>{
    const decodedToken = jwt.verify(req.token,config.SECRET)
    const taskToDelete = await Task.findById(req.params.id)
    if (taskToDelete.user.toString()===decodedToken.id){
        await taskToDelete.delete()
        const parentUser = await User.findById(decodedToken.id)
        parentUser.tasks = parentUser.tasks.filter(t=>t.toString()!==req.params.id)
        await parentUser.save()
        res.status(204).json({message: `Task with id ${req.params.id} deleted`})
    }else{
        res.status(401).json({error:"Unauthorized access for deletion"})
    }
})

module.exports = taskRouter

