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

    let download_doc = '';

    if (foldername !== "certificates" && foldername !== "notices" && foldername !== "orders") {
        download_doc = `../../upload/application_docs/${foldername}`
    }
    else {
        download_doc = `../../upload/${foldername}`
    }
    const filePath = path.join(__dirname, download_doc, filename);

    res.download(filePath, (error) => {
        if (error) {
            console.error('Error downloading file:', error);
            res.status(500).json({ message: 'Error downloading file' });
        }
    });
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

