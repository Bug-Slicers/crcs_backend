const Admin = require("../../models/admin.model");
const { createTokens } = require("../../utilities/createToken");
const { handleError } = require("../../utilities/handleError")
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