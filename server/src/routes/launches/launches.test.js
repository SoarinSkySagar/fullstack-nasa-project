const request = require('supertest')
const app = require('../../app')

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app).get('/launches').expect('Content-Type', /json/).expect(200)
    })
})

describe('Test POST /launches', () => {

    const completeLaunch = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-62 f',
        launchDate: 'January 4, 2028'
    }

    const noDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-62 f',
    }

    const invalidDate = {
        ...noDate,
        launchDate: 'zoot'
    }

    test('It should respond with 201s success', async () => {

        const response = await request(app).post('/launches').send(completeLaunch).expect('Content-Type', /json/).expect(201)

        const requestDate = new Date(completeLaunch.launchDate).valueOf()
        const responsedate = new Date(response.body.launchDate).valueOf()
        expect(responsedate).toBe(requestDate)

        expect(response.body).toMatchObject(noDate)
    })

    test('It should catch missing required properties', async () => {
        const response = await request(app).post('/launches').send(noDate).expect('Content-Type', /json/).expect(400)

        expect(response.body).toStrictEqual({
            error: 'Missing params'
        })
    })

    test('It should catch invalid dates', async () => {
        const response = await request(app).post('/launches').send(invalidDate).expect('Content-Type', /json/).expect(400)

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date'
        })
    })

})

describe('Test DELETE /launches/:id', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app).delete('/launches/100').expect('Content-Type', /json/).expect(200)

        expect(response.body).toMatchObject({
            upcoming: false,
            success: false
        })
    })

    test('It should catch requests not in memory', async () => {
        const response = await request(app).delete('/launches/1').expect('Content-Type', /json/).expect(404)

        expect(response.body).toStrictEqual({
            error: 'Launch not found'
        })
    })
})