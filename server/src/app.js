const express = require('express')
const cors = require('cors')

const planetsRouter = require('./routes/planets/planets.router')
const middlewares = require('./routes/middlewares/middlewares.controller')

const app = express()

app.use(middlewares.responseTime)
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json())
app.use(planetsRouter)

module.exports = app