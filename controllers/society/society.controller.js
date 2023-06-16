const Application = require("../../models/application.model");
const Society = require("../../models/societies.model");
const { createTokens } = require("../../utilities/createToken");
const { handleError } = require("../../utilities/handleError");

const maxAge = 3 * 24 * 60 * 60;

module.exports.test = (req, res) => {
    res.status(200).json({
        message: "Test Route for societies",
        success: true,
    })
}

module.exports.society_login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const society = await Society.login({

            email,
            password
        })
        const token = createTokens(society._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ society });
    } catch (err) {
        const errors = handleError(err);
        res.send(503).json({ errors });
    }
};

module.exports.society_signup = async (req, res) => {
    const { society_name, address, pincode, state, district, society_type, designation, pan_number, email, phone_number, password, is_approved } = req.body;

    try {
        const society = await Society.create({
            society_name,
            address,
            pincode,
            state,
            district,
            society_type,
            designation,
            pan_number,
            email,
            phone_number,
            password,
            is_approved
        })

        const society_id = society._id;
        const application = await Application.create({
            society_id,
            application_type: 'New Registration',
            application_title: 'Application for new Registration',
            application_desc: 'This application is for creating new society for hardworkers'
        })
        const token = createTokens(society_id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ society, application });
    } catch (err) {
        const errors = handleError(err);
        console.log(err);
        res.status(503).json({ errors });
    }

}