const Admin = require("../../models/admin.model");
const Society = require("../../models/societies.model")
const Application = require("../../models/application.model")
const { createTokens } = require("../../utilities/createToken");
const { handleError } = require("../../utilities/handleError")
const fs = require('fs')
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

module.exports.approve_societies = async (req, res) => {

    const application_id = req.params.id;
    try {

        const application = await Application.findOne({
            _id: application_id
        })

        const data = await Society.updateOne(
            { _id: application.society_id },
            {
                $set: {
                    is_approved: true,
                }
            }
        );


        const application_data = await Application.updateOne(
            { _id: application_id },
            {
                $set: {
                    certificate: `certificate_${application_id}.pdf`,
                    is_approved: true,
                }
            }
        )


        res.status(200).json({
            msg: "Society approved and Registered and certificate uploaded",
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
