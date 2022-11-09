const Task = require('../models/task')
const taskRouter = require('express').Router()

taskRouter.get("/", async (req,res)=>{
    const result = await Task.find({})
    res.json(result)
})

taskRouter.get("/:id", async (req,res)=>{
    const result = await Task.findById(req.params.id)
    res.json(result)
})

taskRouter.put("/:id", async(req,res)=>{
    const result = await Task.findByIdAndUpdate(req.params.id,{status:req.body.status})
    res.status(201).json(result)
})

taskRouter.post("/", async (req,res)=>{
    if(req.body!=undefined){
        const task = new Task({
            "content": req.body.content,
            "responsible": req.body.responsible,
            "date" : new Date()
        })
        const result = await task.save()
        res.status(201).json(result)
          
    }else{
        res.status(400).json({ 
            error: 'content missing' 
        })
    }
})

taskRouter.delete("/:id", async (req,res)=>{
    await Task.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

module.exports = taskRouter

