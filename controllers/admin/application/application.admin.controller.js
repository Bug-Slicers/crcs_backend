const Application = require("../../../models/application.model");
const Society = require("../../../models/societies.model");
const fs = require('fs');

module.exports.approveApplication = async (req, res) => {
    const app_id = req.params.id;
    try {

        const application = await Application.findOne({ _id: app_id });

        if (application.application_type == "New Registration" || application.application_type == "Re-Submission of New Registration") {
            const data = await Society.updateOne(
                { _id: application.society_id },
                {
                    $set: {
                        is_approved: true,
                    }
                }
            );
        }

        const application_data = await Application.updateOne(
            { _id: app_id },
            {
                $set: {
                    certificate: `certificate_${app_id}.pdf`,
                    is_approved: true,
                }
            }
        )

        res.status(200).json({
            msg: `Application for ${application.application_type} is approved and certificate is uploaded`,
            success: true
        })
    } catch (err) {
        console.error("Error during approval : ", err);
        res.status(500).json({
            msg: "Internal Server Error",
            success: true,
        })
    }
}

module.exports.declineApplication = async (req, res) => {
    const app_id = req.params.id;

    try {
        let orderName = null;
        let noticeName = null;

        if (req.files.order) {
            orderName = `order_${app_id}.pdf`;
        }
        if (req.files.notice) {
            noticeName = `notice_${app_id}.pdf`;
        }

        const application_data = await Application.findOne({ _id: app_id });

        const data = await Application.updateOne(
            { _id: app_id },
            {
                $set: {
                    order: orderName,
                    notice: noticeName,
                }
            }
        )

        res.status(200).json({
            msg: `Application for ${application_data.application_type} is declined and notice and order have been uploaded`,
            success: true,
        })

    } catch (err) {
        console.error("Error while declining approval : ", err);
        res.status(500).json({
            msg: "Internal Server error",
            success: false
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