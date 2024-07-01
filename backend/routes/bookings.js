const express = require('express')

// recentBookingController.js function
const { getRecentBookings, deleteBooking } = require('../controllers/recentBookingController')

const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// require auth for all lead routes
router.use(requireAuth)

/** --- ADMIN --- */
router.get('/recent-bookings', getRecentBookings) // GET recent bookings
router.delete('/:id', deleteBooking) // DELETE booking

module.exports = router
