const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const statusSchema = new Schema({
    employeeName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Lead Generation", "Telemarketer", "Team Leader"]
    },
    status: {
        type: String,
        enum: ["Start Shift", "End Shift", "First Break", "Lunch", "Team Meeting", "Coaching"],
    },
    userLG_id: {
        type: Schema.Types.ObjectId,
        ref: 'UserLG', // Ensure this matches your UserLG model name
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Employee Status', statusSchema)
