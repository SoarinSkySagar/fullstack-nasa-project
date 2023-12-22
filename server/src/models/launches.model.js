const launchesDB = require('./launches.mongo')
const planetsDB = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['nil'],
    upcoming: false,
    success: false  
}

saveLaunch(launch)



async function existsLaunch(launchId) {
    return await launchesDB.findOne({
        flightNumber: launchId
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB
        .findOne()
        .sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber
}

async function getAllLaunches() {
    return await launchesDB.find({}, {
        '_id': 0,
        '__v': 0
    })
}

async function saveLaunch(launch) {
    const planet = await planetsDB.findOne({
        keplerName: launch.target
    })

    if (!planet) {
        throw new Error('No matching planet found')
    } else {
        await launchesDB.findOneAndUpdate({
            flightNumber: launch.flightNumber
        }, launch, {
            upsert: true
        })
    }
}

async function addNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign({}, launch);
    newLaunch.flightNumber = newFlightNumber;
    newLaunch.customer = ['Sagar'];
    newLaunch.upcoming = true;
    newLaunch.success = true;
    await saveLaunch(newLaunch)
}

async function abort(launchId) {
    try {
        const aborted = await launchesDB.updateOne({
            flightNumber: launchId
        }, {
            upcoming: false,
            success: false
        })
        return aborted
    } catch(err) {
        return {
            error: err
        }
    }
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunch,
    abort
}