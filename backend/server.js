require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require("body-parser");

// ROUTES IMPORT
const leadRoutes = require('./routes/leads')
const userLGRoutes = require('./routes/userLG')
const emailRoutes = require('./routes/emails')
const bookingRoutes = require('./routes/bookings')
const inventoryRoutes = require('./routes/inventory')
const serviceRoutes = require('./routes/services')
const passwordRoutes = require('./routes/password')
const notificationRoutes = require('./routes/notifications');
const templateRoutes = require('./routes/templates');
const statusRoutes = require('./routes/status');

// express app
const app = express()

// CORS middleware
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(
    cors({
        origin: "*",
    }),
    (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
        next();
    }
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/leads', leadRoutes)
app.use('/api/userLG', userLGRoutes)
app.use('/api/emails', emailRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/inventories', inventoryRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/password', passwordRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/status', statusRoutes)

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
