require('dotenv').config();
require('./db');
const express = require('express')
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/task')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.get("/api/tasks/",(req,res)=>{
    Task.find({})
        .then(data=>res.json(data))
})

app.get("/api/tasks/:id",(req,res)=>{
    Task.findById(req.params.id)
        .then(data=>res.json(data))
})

app.put("/api/tasks/:id",(req,res)=>{
    Task.findByIdAndUpdate(req.params.id,{status:req.body.status})
    .then(result => {
        res.status(201).json(result)
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        })
      })
})

app.post("/api/tasks",(req,res)=>{
    if(req.body!=undefined){
        const task = new Task({
            "content": req.body.content,
            "responsible": req.body.responsible,
            "date" : new Date(),
            "status" : false
        })
        task.save()
        .then(result => {
            res.status(201).json(result)
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            })
          })
    }else{
        return response.status(400).json({ 
            error: 'content missing' 
          })
    }
})

app.delete("/api/tasks/:id",(req,res)=>{
    Task.findByIdAndRemove(req.params.id)
        .then(res.status(204).end())
})

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log("Server running on port ",PORT)
})