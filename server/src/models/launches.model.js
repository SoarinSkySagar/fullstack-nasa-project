const launches = new Map()

let latestFlightNumber = 100

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch)

function existsLaunch(launchId) {
    return launches.has(launchId)
}

function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch(launch) {
    latestFlightNumber++
    const newLaunch = Object.assign({}, launch);
    newLaunch.flightNumber = latestFlightNumber;
    newLaunch.customer = ['ZTM', 'Sagar'];
    newLaunch.upcoming = true;
    newLaunch.success = true;
    launches.set(newLaunch.flightNumber, newLaunch);
}

function abort(launchId) {
    const aborted = launches.get(launchId)
    aborted.upcoming = false
    aborted.success = false
    return aborted
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunch,
    abort
}