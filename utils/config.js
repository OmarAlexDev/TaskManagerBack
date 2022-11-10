require('dotenv').config()

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV
const MONGODB_URL = NODE_ENV !== 'test' ? process.env.MONGODB_URL : process.env.TEST_MONGODB_URL

module.exports = {PORT,MONGODB_URL, NODE_ENV}