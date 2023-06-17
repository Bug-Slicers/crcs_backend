const jwt = require("jsonwebtoken");
const Admin = require("../models/societies.model");
const Society = require("../models/societies.model");

const requireSocietyAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                let AuthError = { error: "Society is not authenticated!" };
                res.status(401).send({ AuthError });
            } else {
                const society = await Society.findById(decodedToken.id);
                if (society) {
                    req.Society = society;
                    next();
                } else {
                    let AuthError = { error: "Society is not authenticated!" };
                    res.status(401).send({ AuthError });
                }
            }
        });
    } else {
        let AuthError = { error: "Society is not authenticated!" };
        res.status(401).send({ AuthError });
    }
};

module.exports = { requireSocietyAuth };