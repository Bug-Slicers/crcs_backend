const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");

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

let emailTemplate = '<p>&lt;html&gt;</p><p>&nbsp; &lt;head&gt;</p><p>&nbsp; &nbsp; &lt;title&gt;Welcome to CRCS&lt;/title&gt;</p><p>&nbsp; &lt;/head&gt;</p><p>&nbsp; &lt;body&gt;</p><p>&nbsp; &nbsp; &lt;h1&gt;Welcome to CRCS&lt;/h1&gt;</p><p>&nbsp; &nbsp; &lt;p&gt;Dear {{name}},&lt;/p&gt;</p><p>&nbsp; &nbsp; &lt;p&gt;Your account for {{society_name}} has been successfully created on CRCS.&lt;/p&gt;</p><p>&nbsp; &nbsp; &lt;p&gt;You can now log in to your account and fill out the application form to get your society approved and registered.&lt;/p&gt;</p><p>&nbsp; &nbsp; &lt;br&gt;</p><p>&nbsp; &nbsp; &lt;p&gt;Best regards,&lt;/p&gt;</p><p>&nbsp; &nbsp; &lt;p&gt;The CRCS Team&lt;/p&gt;</p><p>&nbsp; &lt;/body&gt;</p><p>&lt;/html&gt;</p><div><br /></div>'
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