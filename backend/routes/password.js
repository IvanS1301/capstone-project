const express = require('express');

// controller functions
const { forgotPassword,
    resetPassword
} = require('../controllers/passwordController');

const router = express.Router();

// Import the requireAuth middleware
const requireAuth = require('../middleware/requireAuth')

router.post('/forgot-password', forgotPassword);
router.post('/reset/:id/:token', resetPassword);

// Server-side rendering route
router.get('/reset/:id/:token', (req, res) => {
    res.render('reset-password', { token: req.params.token });
});

module.exports = router;