const jwt = require("jsonwebtoken")
module.exports.createTokens = (id) => {
    const maxAge = 3 * 24 * 60 * 60;
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: maxAge,
    });
};
