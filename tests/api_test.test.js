const test_helper = require('./test_helper')
const app = require('../app')
const Task = require('../models/task')
const supertest = require('supertest')
const { connection } = require('mongoose')
const api =  supertest(app)

const initialTasks=test_helper.initialTasks

beforeEach(async()=>{
    await Task.deleteMany({})
    const tasks = initialTasks.map(t=>new Task(t))
    const savedTasks = tasks.map(t=>t.save())
    await Promise.all(savedTasks)
})

describe('get method', () => {
    test('retrieving all tasks as json', async () => {
        const result = await api
            .get('/api/tasks')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(result.body.length).toBe(initialTasks.length)
    })

    test('retrieve task with valid id', async()=>{
        const tasks = await test_helper.getDB()
        const result = await api.get(`/api/tasks/${tasks[0].id}`)
            .expect(200)

        expect(result.body).toMatchObject({
            content: "Pick up children",
            responsible:"Penny Wise",
            date:"2022-10-30T18:40:47.714Z",
            status:false
        })
    })

    test('invalid id returns a 400 bad request',async ()=>{
        const result = await api.get('/api/tasks/1')
            .expect(400)
    })

})

describe('post method',()=>{
    test('creating a new blog', async ()=>{
        const newTask = {
            content: "Use the Infinity Gauntlet",
            responsible:"Tony Stark"
        }
        await api.post('/api/tasks/')
            .send(newTask)
            .expect(201)

        const currDB = await test_helper.getDB()
        expect(currDB.length).toBe(test_helper.initialTasks.length+1)
    })

    test('request without content or responsible parameters return 400', async ()=>{
        const newTask = {
            responsible:"Tony Stark"
        }
        await api.post('/api/tasks/')
            .send(newTask)
            .expect(400)
    })

    test('creating a note without date or status parameters generates default values ', async ()=>{
        const newTask = {
            responsible: "Tony Stark",
            content: "Use Infinty Gauntlet"
        }
        const result = await api.post('/api/tasks')
            .send(newTask)
            .expect(201) 
        expect(result.body.status).toBeDefined()
        expect(result.body.date).toBeDefined()
    })

    test('remove unexpected parameters in request', async ()=>{
        const newTask = {
            responsible: "Tony Stark",
            content: "Use Infinty Gauntlet",
            movies: 4
        }
        const result = await api.post('/api/tasks')
            .send(newTask)
            .expect(201) 
        expect(result.body.movies).not.toBeDefined()
    })
})

describe('put method',()=>{
    test('updates correctly with valid id', async ()=>{
        const result = await test_helper.getDB()
        const update = {status : true}

        const updatedTask = await api.put(`/api/tasks/${result[0].id}`)
            .send(update)
            .expect(201)
        expect(updatedTask.body.status).toBe(true)    
    })

    test('returns 400 trying to update an invalid endpoint', async ()=>{
        const update = {status : true}
        const updatedTask = await api.put(`/api/tasks/1}`)
            .send(update)
            .expect(400)  
    })

    test('returns 400 trying to update with invalid schema', async ()=>{
        const result = await test_helper.getDB()
        const update = {movies : 3}
        const updatedTask = await api.put(`/api/tasks/${result[0].id}}`)
            .send(update)
            .expect(400)  
    })
})

describe('delete method',()=>{
    test('deletes correctly with valid id', async ()=>{
        const taskToDelete = await test_helper.getDB()
        const result = await api.delete(`/api/tasks/${taskToDelete[0].id}`)
            .expect(204)
        
        const currDB = await test_helper.getDB()
        expect(currDB.length).toBe(initialTasks.length-1)
    })

    test('returns 400 trying to delete invalid id', async ()=>{
        const result = await api.delete(`/api/tasks/1`)
            .expect(400)
    })
})

afterAll(()=>{
    connection.close()
})