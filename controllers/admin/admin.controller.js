const Admin = require("../../models/admin.model");
const Society = require("../../models/societies.model")
const Application = require("../../models/application.model")
const { createTokens } = require("../../utilities/createToken");
const { handleError } = require("../../utilities/handleError")
const fs = require('fs');
const maxAge = 3 * 24 * 60 * 60;

module.exports.test = (req, res) => {
    res.status(200).json({
        message: "Test Route for admin",
        success: true,
    })
};

module.exports.admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.login(email, password);
        const token = createTokens(admin._id);
        console.log(token);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ admin });
    } catch (err) {
        console.log(err);
        const errors = handleError(err);
        console.log(errors);
        res.status(400).json({ errors });
    }
};

module.exports.admin_signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.create({
            email,
            password,
        });
        const token = createTokens(admin._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ admin });
    } catch (err) {
        const errors = handleError(err);
        res.status(404).json({ errors });
    }
};

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
