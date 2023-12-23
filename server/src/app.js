const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const apiRouter = require('./routes/api')
require('dotenv').config()

const app = express()

app.use(cors({
    origin: process.env.CORS_URL
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/v1', apiRouter)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app