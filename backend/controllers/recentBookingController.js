const RecentBooking = require('../models/recentBookingModel')
const { updateInventoryCounts } = require('./inventoryController')
const mongoose = require('mongoose')

const getRecentBookings = async (req, res) => {
    try {
        const recentBookings = await RecentBooking.find().populate('lead').sort({ createdAt: -1 })
        res.status(200).json(recentBookings)
    } catch (error) {
        console.error('Error fetching recent bookings:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

/** --- DELETE BOOKING --- */
const deleteBooking = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No booking found' })
    }

    const recentBookings = await RecentBooking.findOneAndDelete({ _id: id })

    if (!recentBookings) {
        return res.status(400).json({ error: 'No booking found' })
    }

    // Update inventory after deleting booking
    await updateInventoryCounts()

    res.status(200).json(recentBookings)
}

module.exports = { getRecentBookings, deleteBooking }