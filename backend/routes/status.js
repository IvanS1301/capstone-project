const express = require('express')

// statusController.js function
const { getStatusLogs,
    getStatusStaff,
    getSingleStatus,
    deleteStatus
} = require('../controllers/statusController')

const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// require auth for all lead routes
router.use(requireAuth)

/** --- ADMIN --- */
router.get('/status-logs', getStatusLogs) // GET all status logs

/** --- LEADGEN AND TELEMARKETER --- */
router.get('/staff', getStatusStaff) // GET all status logs for staff

/** --- ALL --- */
router.get('/:id', getSingleStatus) // GET a single status
router.delete('/:id', deleteStatus) // DELETE status

module.exports = router
