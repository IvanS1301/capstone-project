const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    numberOfLeads: {
        type: String
    },
    numberOfUsers: {
        type: String
    },
    numberOfAssignedLeads: {
        type: String
    },
    numberOfUnassignedLeads: {
        type: String
    },
    numberOfEmails: {
        type: String
    },
    typeCounts: {
        type: Map,
        of: Number,
        required: true
    },
    callDispositionCounts: {
        type: Map,
        of: Number,
        required: true
    },
    teamBookedCounts: {
        type: Map,
        of: Number,
        required: true,
        default: { 'Team A': 0, 'Team B': 0, 'Team C': 0 }
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
},
    { timestamps: { updatedAt: true } }
);

module.exports = mongoose.model('Inventory', inventorySchema)
