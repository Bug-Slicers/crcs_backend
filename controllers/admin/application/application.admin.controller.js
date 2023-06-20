const Application = require("../../../models/application.model");
const Society = require("../../../models/societies.model");
const fs = require('fs');
const { sendApproveApplicationEmail, sendDeclineApplicationEmail } = require("../../../utilities/email/sendEmails");

module.exports.approveApplication = async (req, res) => {
    const app_id = req.params.id;
    try {

        const application = await Application.findOne({ _id: app_id }).populate('society_id');

        if (!application.is_approved) {
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
                        certificate: `/download/certificates/certificate_${app_id}.pdf`,
                        is_approved: true,
                    }
                }
            )


            const emailOptions = {
                name: application.society_id.name_of_officer,
                reason: application.application_type,
                email: application.society_id.email
            }
            sendApproveApplicationEmail(emailOptions);
            res.status(200).json({
                msg: `Application for ${application.application_type} is approved and certificate is uploaded`,
                success: true
            })
        } else {
            res.status(400).json({
                success: false,
                msg: "Application is already approved",
            })
        }
    } catch (err) {
        console.error("Error during approval : ", err);
        res.status(500).json({
            msg: "Internal Server Error",
            success: false,
        })
    }
}

module.exports.declineApplication = async (req, res) => {
    const app_id = req.params.id;

    try {
        let orderName = null;
        let noticeName = null;

        if (req.files && req.files.order) {
            orderName = `/download/orders/order_${app_id}.pdf`;
        }
        if (req.files && req.files.notice) {
            noticeName = `/download/notices/notice_${app_id}.pdf`;
        }

        const application_data = await Application.findOne({ _id: app_id }).populate("society_id");

        if (!application_data.is_approved) {
            const data = await Application.updateOne(
                { _id: app_id },
                {
                    $set: {
                        order: orderName,
                        notice: noticeName,
                    }
                }
            )
            const emailOptions = {
                name: application_data.society_id.name_of_officer,
                reason: application_data.application_type,
                id: app_id,
                email: application_data.society_id.email
            }
            sendDeclineApplicationEmail(emailOptions)
            res.status(200).json({
                msg: `Application for ${application_data.application_type} is declined and notice and order have been uploaded`,
                success: true,
            })
        } else {
            res.status(400).json({
                success: false,
                msg: "Cannot decline already approved applications"
            })
        }



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
        const applications = await Application.find({ is_approved: false }).populate('society_id');
        // console.log(applications)
        res.status(200).json({
            msg: "Applications that are not approved as of now",
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