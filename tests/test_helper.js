const Task = require('../models/task')

const initialTasks = [
    {
        content: "Pick up children",
        responsible:"Penny Wise",
        date:"2022-10-30T18:40:47.714Z",
        status:false
    },
    {   
        content:"Save Elizabeth",
        responsible:"Will Turner",
        date:"2022-10-30T21:02:52.558Z",
        status:true
    },
    {   
        content:"Build drug empire",
        responsible:"Walter White",
        date:"2022-10-30T21:10:24.939Z",
        status:false
    },
    {   
        content:"Kill Half Universe",
        responsible:"Thanos",
        date:"2022-10-30T21:10:24.939Z",
        status:true
    }
]

const getDB = async () =>{
    const tasks = await Task.find({})
    return tasks.map(o=>o.toJSON())
}

module.exports = {
    initialTasks, 
    getDB
}