const jwt = require("jsonwebtoken")
module.exports.createTokens = (id) => {
    const maxAge = 3 * 24 * 60 * 60;
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: maxAge,
    });
};

module.exports.createOtpToken = (otp) => {
    const maxAge = 1 * 60 * 60;
    return jwt.sign({ otp }, process.env.SECRET_KEY, {
        expiresIn: maxAge,
    })
}
