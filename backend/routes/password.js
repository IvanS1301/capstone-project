const express = require('express');

// controller functions
const { forgotPassword,
    resetPassword
} = require('../controllers/passwordController');

const router = express.Router();

// Import the requireAuth middleware
const requireAuth = require('../middleware/requireAuth')

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
