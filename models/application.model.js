const mongoose = require('mongoose');
const Society = require('./societies.model');

const applicationSchema = new mongoose.Schema({
    society_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society',
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
            'Reconsideration of New Amendments'
        ],
        required: true,
    },
    application_title: {
        type: String,
        required: true,
    },
    application_desc: {
        type: String,
        required: true
    },
    date_of_application: {
        type: Date,
        default: Date.now,
        required: true,
    },
    supporting_documents: {
        type: [String],
        default: null
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
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
