const bcrypt = require("bcrypt");

module.exports.createSalt = async () => {
    const salt = await bcrypt.genSalt();
    return salt;
}