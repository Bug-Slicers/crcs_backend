const Application = require("../../models/application.model");
const path = require("path")

module.exports.test = (req, res) => {
    res.status(200).json({
        message: "Test Route for application",
        success: true,
    })
}

module.exports.getApprovedApplication = async (req, res) => {
    try {
        const applications = await Application.find({ is_approved: true }).populate("society_id")

        res.status(200).json({
            msg: "Applications that have been approved",
            success: true,
            data: applications
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal server error",
            success: false
        })
    }
}

module.exports.getAllApplication = async (req, res) => {
    try {
        const applications = await Application.find().populate("society_id");

        res.status(200).json({
            msg: "All The Received Applications",
            success: true,
            data: applications
        })

    } catch (error) {

        res.status(500).json({
            msg: "Internal server error",
            success: false
        })

    }
}

module.exports.getApplicationById = async (req, res) => {
    try {
        const app_id = req.params.id;
        const data = await Application.findOne({ _id: app_id });
        res.status(200).json({
            msg: "Application data sent successfully",
            success: true,
            data: data
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            msg: "Internal Server Error",
        })
    }
}

