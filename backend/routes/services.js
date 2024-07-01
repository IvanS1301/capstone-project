const express = require('express')

// leadGenPerformanceController.js functions
const { getLeadGenPerformance } = require('../services/leadGenService');

// bookedUnitsController.js function
const { getBookedUnitsPerformance } = require('../services/TelemarketerService');

const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// require auth for all lead routes
router.use(requireAuth)

/** --- ADMIN --- */
router.get('/lead-gen-performance', getLeadGenPerformance); // GET LeadGen performance
router.get('/booked-units-performance', getBookedUnitsPerformance); // GET booked units performance

module.exports = router