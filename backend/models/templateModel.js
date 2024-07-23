const mongoose = require('mongoose');

const Schema = mongoose.Schema

const templateSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    userLG_id: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Template', templateSchema);
