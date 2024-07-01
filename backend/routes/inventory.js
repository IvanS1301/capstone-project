const express = require('express')

// inventoryController.js function
const { getInventory } = require('../controllers/inventoryController')

const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// require auth for all lead routes
router.use(requireAuth)

/** --- ADMIN --- */
router.get('/inventory', getInventory) // GET inventory

module.exports = router