const Status = require('../models/statusModel');
const mongoose = require('mongoose')

/** --- GET ALL STATUS BY ADMIN --- */
const getStatusLogs = async (req, res) => {
    const { startDate, endDate } = req.query;
    let filter = {};

    if (startDate && endDate) {
        filter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    try {
        const logs = await Status.find(filter).sort({ createdAt: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/** --- GET ALL STATUS BY LEADGEN AND TELEMARKETER ONLY --- */
const getStatusStaff = async (req, res) => {
    const userLG_id = req.userLG._id;
    const { startDate, endDate } = req.query;
    let filter = { userLG_id };

    if (startDate && endDate) {
        filter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    try {
        const logs = await Status.find(filter).sort({ createdAt: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/** --- GET A SINGLE STATUS --- */
const getSingleStatus = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No status found' })
    }

    const logs = await Status.findById(id)

    if (!logs) {
        return res.status(404).json({ error: "No status found" })
    }

    res.status(200).json(logs)
}

/** --- DELETE STATUS --- */
const deleteStatus = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No status found' })
    }

    const logs = await Status.findOneAndDelete({ _id: id })

    if (!logs) {
        return res.status(400).json({ error: 'No status found' })
    }

    res.status(200).json(logs)

}

module.exports = {
    getStatusLogs,
    getStatusStaff,
    getSingleStatus,
    deleteStatus
};
