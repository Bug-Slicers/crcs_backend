const otpGenerator = require("otp-generator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Application = require("../../models/application.model");
const Society = require("../../models/societies.model");
const { sendCreateSocietyEmail, sendResetPasswordEmail } = require("../../utilities/email/sendEmails");
const { createTokens, createOtpToken } = require("../../utilities/createToken");
const { handleError } = require("../../utilities/handleError");
const fs = require("fs");

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
        const society = await Society.login(email, password)
        const token = createTokens(society._id);
        res.cookie("jwt", token, {
            httpOnly: true, maxAge: maxAge * 1000
        });
        res.status(201).json({ success: true, society });
    } catch (err) {
        console.log(err);
        const errors = handleError(err);
        res.status(503).json({ success: false, errors });
    }
};

module.exports.society_signup = async (req, res) => {
    const { society_name, address, name_of_officer, pincode, state, district, society_type, designation, pan_number, email, phone_number, password } = req.body;
    try {
        const logo = req.files;

        const society_logo = "temp";
        const society = await Society.create({
            society_name,
            society_logo,
            address,
            pincode,
            state,
            district,
            society_type,
            name_of_officer,
            designation,
            pan_number,
            email,
            phone_number,
            password,
        })


        const society_id = society._id;
        const originalName = logo.society_logo[0].originalname.replace(/\s+/g, '_');
        const data = await Society.updateOne(
            { _id: society_id },
            {
                $set: {
                    society_logo: `/download/society_logos/${society_id}_${originalName}`
                }
            }
        )

        fs.rename(`upload/society_logos/temp.jpeg`, `upload/society_logos/${society_id}_${originalName}`, (err) => {
            if (err) {
                console.error('Error renaming folder:', err);
            } else {
                console.log('Folder renamed successfully.');
            }
        })


        const token = createTokens(society_id);
        res.cookie("jwt", token, {
            httpOnly: true, maxAge: maxAge * 1000,
            sameSite: "none", secure: "false"
        });
        let sendOptions = {
            name: society.name_of_officer,
            email: society.email,
            society_name: society.society_name,
        };
        sendCreateSocietyEmail(sendOptions);
        res.status(201).json({ success: true, society });
    } catch (err) {
        const errors = handleError(err);
        console.log(err);
        res.status(503).json({ success: false, errors });
    }
}

module.exports.getRegisteredSocieties = async (req, res) => {

    try {
        const societies = await Society.find({ is_approved: true });

        const modifiedSocieties = await Promise.all(
            societies.map(async (society) => {
                let modifiedSociety = society.toJSON();
                const application_data = await Application.findOne(
                    {
                        $and: [
                            { society_id: society._id },
                            {
                                $or: [
                                    { application_type: "Re-Submission of New Registration" },
                                    { application_type: "New Registration" }
                                ]
                            }
                        ]
                    }
                )
                console.log(application_data)
                const newModifedSociety = { ...modifiedSociety, certificate: application_data.certificate }
                return newModifedSociety
            })
        )

        res.status(200).json({
            msg: "All the registered societies",
            success: true,
            data: modifiedSocieties
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Internal Server Error",
            success: false
        })
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        const data = req.Society;
        res.status(200).json({
            succuss: true,
            msg: "profile of Society sent successfully",
            data: data
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: "Internal server error"
        })
    }
}

module.exports.generateOtp = async (req, res) => {
    try {
        const society = req.Society;
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: true
        })
        const society_data = await Society.updateOne(
            { _id: society._id },
            {
                $set: {
                    otp: otp,
                    otp_generation_time: new Date()
                }
            }
        )

        const emailOptions = {
            email: society.email,
            otp: otp,
            name: society.name_of_officer
        }
        sendResetPasswordEmail(emailOptions)
        res.status(200).json({
            success: true,
            msg: "Otp generated successfully and mailed"
        })
    } catch (err) {
        console.error("Error while generating Otp")
        res.status(503).json({
            success: false,
            msg: "Internal Server Error"
        })
    }
}

module.exports.checkOtp = async (req, res) => {

    try {
        const { otp } = req.body;
        const society = req.Society;
        const society_data = await Society.findOne({ _id: society.id })

        const currentTime = new Date();
        const otp_generation = new Date(society.otp_generation_time.getTime() + 5 * 60 * 1000)

        console.log(currentTime)
        console.log(otp_generation)

        if (otp === society_data.otp) {
            if (currentTime <= otp_generation) {
                const otpToken = createOtpToken(otp);
                res.status(200).json({
                    success: true,
                    msg: "Otp verified successfully",
                    token: otpToken,
                })
            } else {
                res.status(422).json({
                    success: false,
                    msg: "Otp has expired and not valid. pls re send email for new otp"
                })
            }
        } else {
            res.status(422).json({
                success: false,
                msg: "otp is not correct."
            })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            msg: "Internal server error"
        })
    }
}

module.exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const society = req.Society;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded)
        if (decoded.otp == society.otp) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            const society_data = await Society.findByIdAndUpdate(society._id, { password: hashedPassword });

            society_data.otp = null;
            society_data.otp_generation_time = null;

            await society_data.save();

            return res.status(200).json({ success: true, message: 'Password reset successful' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
    } catch (err) {
        console.error(err)
        return res.status(400).json({ success: false, message: 'Invalid token' });
    }
}