const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    society_id: {
        type: String,
        required: true,
    },
    application_type: {
        type: String,
        enum: [
            'New Registration',
            'Re-Submission of New Registration',
            'Deemed',
            'Amendments',
            'Conversion',
            'Reconsideration of new amendments'
        ],
        required: true,
    },
    date_of_application: {
        type: Date,
        default: Date.now,
        required: true,
    },
    notice: {
        type: String,
        default: null,
    },
    order: {
        type: String,
        default: null,
    },
    certificate: {
        type: String,
        default: null,
    },
    is_approved: {
        type: Boolean,
        default: false,
    }

    // Other application schema fields...
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;