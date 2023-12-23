const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
require('dotenv').config()

const planetsRouter = require('./routes/planets/planets.router')
const launchesRouter = require('./routes/launches/launchers.router')

const app = express()

app.use(cors({
    origin: '*'
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/planets', planetsRouter)
app.use('/launches', launchesRouter)
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app