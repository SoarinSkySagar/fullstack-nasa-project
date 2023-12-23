const express = require('express')

const planetsRouter = require('./../routes/planets/planets.router')
const launchesRouter = require('./../routes/launches/launchers.router')

const api = express.Router()

api.use('/planets', planetsRouter)
api.use('/launches', launchesRouter)

module.exports = api