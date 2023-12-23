const http = require('http')
require('dotenv').config()

const app = require('./app')
const {mongoConnect} = require('./services/mongo')
const {loadData} = require('./models/planets.model')

const PORT = process.env.PORT

const server = http.createServer(app)

async function startServer() {
    await mongoConnect()
    await loadData()
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    })
}

startServer()