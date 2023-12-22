const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo')

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadData() {
    return new Promise((res, rej) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse.parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
                savePlanet(data)
            }
        })
        .on('error', (err) => {
            console.log(err);
            rej(err)
        })
        .on('end', async () => {
            const count = (await getPlanets()).length
            console.log(`${count} habitable planets found!`);
            res()
        });
    })
}

async function getPlanets() {
    return await planets.find({})
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        })
    } catch(err) {
        console.error(`Could not save planet ${err}`)
    }    
}

  module.exports = {
    loadData,
    getPlanets
  }