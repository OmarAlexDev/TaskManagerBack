const Task = require('../models/task')
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
    if(req.body!=undefined){
        const task = new Task({
            "content": req.body.content,
            "responsible": req.body.responsible
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
    const result = await Task.findByIdAndRemove(req.params.id)
    res.status(204).json({
        message: `Task with id ${req.params.id} deleted`
    })
})

module.exports = taskRouter

