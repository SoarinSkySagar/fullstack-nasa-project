const request = require('supertest')
const app = require('../../app')
const {mongoConnect, mongoDisconnect} = require('./../../services/mongo')
const {loadData} = require('../../models/planets.model')

describe('Test GET /planets', () => {
    beforeAll(async () => {
        await mongoConnect()
        await loadData()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    test('It should respond with 200 success', async () => {
        const response = await request(app).get('/v1/planets')
        expect(response.statusCode).toBe(200)
    })
})