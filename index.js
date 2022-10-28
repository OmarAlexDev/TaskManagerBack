require('dotenv').config();
const express = require('express')
const cors = require('cors');
const app = express()

let tasks = [
    {
      "id": 1,
      "content": "Buying groceries",
      "responsible": "Walter White",
      "date": "Fri Oct 28 2022",
      "status": true
    },
    {
      "id": 2,
      "content": "Walking out dog",
      "responsible": "Shaggy Shaggers",
      "date": "Fri Oct 28 2022",
      "status": false
    },
    {
      "id": 3,
      "content": "Calling plumber",
      "responsible": "Luigi Bros",
      "date": "Fri Oct 28 2022",
      "status": true
    },
    {
      "id": 4,
      "content": "Pick up children from school",
      "responsible": "Penny Wise",
      "date": "Fri Oct 28 2022",
      "status": false
    }
]

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.get("/api/tasks/",(req,res)=>{
    res.json(tasks)
})

app.get("/api/tasks/:id",(req,res)=>{
    const id = req.params.id
    const task = tasks.filter(t=>t.id==id)
    res.json(task)
})

app.put("/api/tasks/:id",(req,res)=>{
    const id = req.params.id
    console.log(req.body)
    tasks=tasks.map(t=>{
        if(t.id==id){
            return {
                ...t,
                status:req.body.status
            }
        }
        else{
            return t
        }
    })
    res.send('Modified task with id: '+id)
})

app.post("/api/tasks",(req,res)=>{
    if(req.body!=undefined){
        const newTask ={
            "id": tasks.length+1,
            "content": req.body.content,
            "responsible": req.body.responsible,
            "date" : new Date().toDateString(),
            "status" : false
        }
        tasks=tasks.concat(newTask)
        res.json(newTask)
    }else{
        return response.status(400).json({ 
            error: 'content missing' 
          })
    }
})

app.delete("/api/tasks/:id",(req,res)=>{
    const id = req.params.id
    tasks=tasks.filter(t=>t.id!=id)
    res.status(204).end()
})

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log("Server running on port ",PORT)
})