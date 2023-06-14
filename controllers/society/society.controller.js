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

module.exports.society_login = (req, res) => {
    const { email, password } = req.body;
    try {
        const society = Society.login({

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

module.exports.society_signup = (req, res) => {
    const { society_name, address, pincode, state, district, society_type, designation, pan_number, email, phone_number, password } = req.body;

    try {
        const society = Society.create({
            society_name,
            address,
            pincode,
            state,
            district,
            society_name,
            designation,
            pan_number,
            email,
            phone_number,
            password,
        })
        const token = createTokens(society._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ society });
    } catch (err) {
        const errors = handleError(err);
        console.log(err);
        res.status(503).json({ errors });
    }

}