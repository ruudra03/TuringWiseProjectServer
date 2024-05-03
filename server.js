// TODO: make use of active flag for permitting the CRUD operations
// TODO: make use of res.download() which is used to prompt a file to be downloaded
// TODO: don’t forget the enctype="multipart/form-data" in your form

require('dotenv').config() // Enable Environment Variables
require('express-async-errors')

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConnection')

const { logEvents, logger } = require('./middlewares/logger')
const errorHandler = require('./middlewares/errorHandler')

const rootRoutes = require('./routes/root')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const publicRoutes = require('./routes/publicRoutes')
const orgCardRoutes = require('./routes/orgCardRoutes')
const articleRoutes = require('./routes/articleRoutes')
const commentRoutes = require('./routes/commentRoutes')
const imageRoutes = require('./routes/imageRoutes')
const researchRoutes = require('./routes/researchRoutes')

const PORT = process.env.PORT

console.log(`Node environment: ${process.env.NODE_ENV}`)

// Database Connection
connectDB()

// Middlewares
app.use(logger) // Server Logger
app.use(cors(corsOptions)) // Handle Cross-Origin-Requests using corsOptions
app.use(express.json()) // JSON support
app.use(cookieParser()) // Server Cookies Parser
app.use(express.urlencoded({ extended: true }))

// Static files
app.use('/', express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', rootRoutes) // Root Index Route
app.use('/auth', authRoutes) // Auth Route
app.use('/users', userRoutes) // Users Route
app.use('/posts', postRoutes) // Posts Route
app.use('/public', publicRoutes) // Public Routes
app.use('/orgCard', orgCardRoutes) // Organisation Card Routes
app.use('/articles', articleRoutes) // Article Routes
app.use('/comments', commentRoutes) // Comment Routes
app.use('/images', imageRoutes) // Image Routes
app.use('/researches', researchRoutes) // Research Routes

app.use('*', (req, res) => { // 404 Not Found Route
    // Send error response code
    res.status(404)
    if (req.accepts('html')) { // Try to send 404.html file
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) { // Then try sending JSON response message
        res.json({ message: '404 Not Found' })
    } else { // Finally send simple text response
        res.type('txt').send('404 Not Found')
    }
})

// Use errorHandler Middleware before App starts to listen
app.use(errorHandler)

// Mongoose Connection
mongoose.connection.once('open', () => { // If DB is connected
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => { // If failed to connect to DB
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'dbErrLog.log')
})