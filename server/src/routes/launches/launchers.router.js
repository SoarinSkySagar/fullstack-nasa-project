const express = require('express')
const launchesController = require('./launches.controller')

const launchesRouter = express.Router()

launchesRouter.get('/', launchesController.httpGetAllLaunches)

launchesRouter.post('/', launchesController.httpAddNewLaunch)

module.exports = launchesRouter 