const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const { emailTemplate, approveEmailTemplate, declineEmailTemplate } = require("./emailTemplates/emailTemplates");
const transponder = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});


module.exports.sendCreateSocietyEmail = async (data) => {
    let template = Handlebars.compile(emailTemplate);

    let result = template(data);
    let mailOptions = {
        from: process.env.EMAIL,
        to: data.email,
        subject: "Your account has been created on CRCS",
        html: result,
    };

    transponder.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("EMAIL IS NOT SENT", err);
        } else {
            console.log("EMAIL IS SENT SUCCESSFULLY.");
        }
    });
};

module.exports.sendApproveApplicationEmail = async (data) => {
    let template = Handlebars.compile(approveEmailTemplate);

    let result = template(data);
    let mailOptions = {
        from: process.env.EMAIL,
        to: data.email,
        subject: "Your Application has been approved",
        html: result,
    };

    transponder.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("EMAIL IS NOT SENT", err);
        } else {
            console.log("EMAIL IS SENT SUCCESSFULLY.");
        }
    });
};

module.exports.sendDeclineApplicationEmail = async (data) => {
    let template = Handlebars.compile(declineEmailTemplate);

    let result = template(data);
    let mailOptions = {
        from: process.env.EMAIL,
        to: data.email,
        subject: "Your Application has been declined",
        html: result,
    };

    transponder.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("EMAIL IS NOT SENT", err);
        } else {
            console.log("EMAIL IS SENT SUCCESSFULLY.");
        }
    });
};