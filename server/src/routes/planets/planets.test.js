const request = require('supertest')
const app = require('../../app')
const {mongoConnect, mongoDisconnect} = require('./../../services/mongo')

describe('Test GET /planets', () => {
    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    test('It should respond with 200 success', async () => {
        const response = await request(app).get('/planets')
        expect(response.statusCode).toBe(200)
    })
})