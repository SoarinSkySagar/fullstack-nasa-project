const axios = require('axios')
const launchesDB = require('./launches.mongo')
const planetsDB = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

async function populateLaunches() {
    console.log('Downloading launch data...')
    const response = await axios.post(process.env.SPACEX_API_URL, {
        query: {},
        options:{
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {name: 1}
                }, {
                    path: 'payloads',
                    select: {customers: 1}
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log("Problem downloading launch data")
        throw new Error("Launch data download failed")
    }

    const launchDoxx = response.data.docs
    for(const launchDoc of launchDoxx) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission:  launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }

        console.log(`${launch.flightNumber} ${launch.mission}`)

        await saveLaunch(launch )
    }
}

async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })

    if (firstLaunch) {
        console.log('Launch Data already loaded')
        return
    } else {
        await populateLaunches()
    } 
}

async function findLaunch(filter) {
    return await launchesDB.findOne(filter)
}

async function existsLaunch(launchId) {
    return await findLaunch({
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

async function getAllLaunches(skip, limit) {
    return await launchesDB.find({}, {
        '_id': 0,
        '__v': 0
    })
    .sort({
        flightNumber: 1
    })
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launch) {
    await launchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function addNewLaunch(launch) {

    const planet = await planetsDB.findOne({
        keplerName: launch.target
    })

    if (!planet) {
        throw new Error('No matching planet found')
    }

    const newFlightNumber = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign({}, launch);
    newLaunch.flightNumber = newFlightNumber;
    newLaunch.customer = ['Sagar'];
    newLaunch.upcoming = true;
    newLaunch.success = true;
    await saveLaunch(newLaunch)
}

async function abort(launchId) {
    const aborted = await launchesDB.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })
    return aborted.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunch,
    abort,
    loadLaunchData
}