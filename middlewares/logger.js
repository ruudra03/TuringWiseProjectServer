const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs') // File System
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'ddMMyyyy\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        // Check if log file exists
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            // Create the file if it doesn't exists
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }

        // Append logItem to the file
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

// Logger Middleware
const logger = (req, res, next) => {
    logEvents(`${req.headers.origin}\t${req.method}\t${req.url}`, 'serverReqLog.log')
    console.log(`${req.method}\t${req.path}`)
    next()
}

module.exports = { logEvents, logger }