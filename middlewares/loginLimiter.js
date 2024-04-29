const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // equals to 1min
    max: 5, // Limit each IP to 5 login requests per window per minute
    message: {
        message: 'Too many login attempts from this IP detected. Please try again after 60 seconds.'
    },
    handler: (req, res, next, options) => {
        logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'tooManyReqLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // Return rate limit info in the RateLimit-** headers
    legacyHeaders: false, // Disable the 'X-RateLimit-* headers
})

module.exports = loginLimiter