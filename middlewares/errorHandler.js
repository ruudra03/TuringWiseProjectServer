const { logEvents } = require('./logger')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.headers.origin}\t${req.method}\t${req.url}`, 'serverErrLog.log')
    console.log(err.stack)

    // Check if Server Status value exists
    const status = res.statusCode ? res.statusCode : 500 // Server Error

    // Return Status
    res.status(status)

    res.json({ message: err.message, isError: true })
}

module.exports = errorHandler