const Application = require("../../models/application.model");
const path = require("path")

module.exports.test = (req, res) => {
    res.status(200).json({
        message: "Test Route for application",
        success: true,
    })
}

module.exports.createApplication = async (req, res) => {
    const { society_id, application_type, application_desc, application_title } = req.body;

    try {
        const application = await Application.create({
            society_id,
            application_type,
            application_title,
            application_desc
        })

        res.status(200).json({
            msg: `application created for ${application_type} and waiting for approval`,
            success: true,
        })

    } catch (err) {
        console.error("Error while creating application: ", err);
        res.status(500).json({
            msg: "Internal Server Error",
            success: false,
        })
    }
}

module.exports.getApplicationForApproval = async (req, res) => {

    try {
        const applications = await Application.find({ is_approved: false });

        const modifiedApplications = applications.map(app => {
            const modifiedApp = app.toJSON();
            modifiedApp.notice = `/download/notices/${app.notice}`;
            modifiedApp.order = `/download/orders/${app.order}`;
            modifiedApp.certificate = `/download/certificates/${app.certificate}`;

            return modifiedApp
        })

        res.status(200).json({
            msg: "Applications that are not approved as of now",
            success: true,
            data: modifiedApplications
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal server error",
            success: false
        })
    }
}

module.exports.getApprovedApplication = async (req, res) => {
    try {
        const applications = await Application.find({ is_approved: true })

        const modifiedApplications = applications.map(app => {
            const modifiedApp = app.toJSON();
            modifiedApp.notice = `/download/notices/${app.notice}`;
            modifiedApp.order = `/download/orders/${app.order}`;
            modifiedApp.certificate = `/download/certificates/${app.certificate}`;

            return modifiedApp
        })

        res.status(200).json({
            msg: "Applications that have been approved",
            success: true,
            data: modifiedApplications
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
        const applications = await Application.find();
        const modifiedApplications = applications.map(app => {
            const modifiedApp = app.toJSON();
            modifiedApp.notice = `/download/notices/${app.notice}`;
            modifiedApp.order = `/download/orders/${app.order}`;
            modifiedApp.certificate = `/download/certificates/${app.certificate}`;

            return modifiedApp
        })

        res.status(200).json({
            msg: "All The Received Applications",
            success: true,
            data: modifiedApplications
        })

    } catch (error) {

        res.status(500).json({
            msg: "Internal server error",
            success: false
        })

    }
}

module.exports.downloadFile = (req, res) => {
    const filename = req.params.filename;
    const foldername = req.params.folder;

    const filePath = path.join(__dirname, `../../upload/${foldername}`, filename);

    res.download(filePath, (error) => {
        if (error) {
            console.error('Error downloading file:', error);
            res.status(500).json({ message: 'Error downloading file' });
        }
    });
}

