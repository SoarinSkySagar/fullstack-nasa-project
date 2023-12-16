function responseTime(req, res, next) {
    const start = Date.now()
    next()
    const end = Date.now()
    const time = end - start
    console.log(`${req.method} ${req.baseUrl}${req.url} ${time}ms`)
}

module.exports = {
    responseTime,
}