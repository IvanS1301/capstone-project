const express = require('express');
const { getNotifications, markAsRead, readByAgent, readByLeadGen } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/:id/agent', readByAgent);
router.patch('/:id/leadgen', readByLeadGen);

module.exports = router;
