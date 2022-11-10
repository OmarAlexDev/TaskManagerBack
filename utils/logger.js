const config = require('../utils/config')

const info = (...params)=>{
    config.NODE_ENV !== 'test' ? console.log(...params) : null
}

const error = (...params)=>{
    config.NODE_ENV !== 'test' ? console.error(...params) : null
}

module.exports = {info,error}