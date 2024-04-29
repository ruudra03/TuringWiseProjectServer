const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    // Options
    origin: (origin, callback) => {
        // Only allow requests from origins in allowedOrigins or no origin (eg: Postman requests)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions