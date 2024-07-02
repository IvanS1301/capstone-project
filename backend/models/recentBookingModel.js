const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recentBookingSchema = new Schema({
    telemarketerName: {
        type: String,
        required: true
    },
    callDisposition: {
        type: String,
        enum: ["Booked"], // This schema only deals with 'Booked' callDisposition
        required: true
    },
    lead: {
        type: Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },
    leadName: {
        type: String,
        required: true
    },
    team: {
        type: String,
        enum: ["Team A", "Team B", "Team C"], // Define the enum here
    }
}, { timestamps: true });

module.exports = mongoose.model('RecentBooking', recentBookingSchema)
