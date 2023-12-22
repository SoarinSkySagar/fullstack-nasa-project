const {getPlanets} = require('../../models/planets.model')

async function getAllPlanets(req, res) {
    return res.status(200).json(await getPlanets())
}

module.exports = {
    getAllPlanets,
}       