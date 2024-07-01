require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

// ROUTES IMPORT
const leadRoutes = require('./routes/leads')
const userLGRoutes = require('./routes/userLG')
const emailRoutes = require('./routes/emails')
const bookingRoutes = require('./routes/bookings')
const inventoryRoutes = require('./routes/inventory')
const serviceRoutes = require('./routes/services')
const passwordRoutes = require('./routes/password')

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/leads', leadRoutes)
app.use('/api/userLG', userLGRoutes)
app.use('/api/emails', emailRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/inventories', inventoryRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/password', passwordRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })