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

let emailTemplate = `<div><br /></div><div><span style="font-family: Söhne, ui - sans - serif, system - ui, -apple - system, & quot;Segoe UI & quot;, Roboto, Ubuntu, Cantarell, & quot;Noto Sans & quot;, sans - serif, & quot;Helvetica Neue & quot;, Arial, & quot;Apple Color Emoji & quot;, & quot;Segoe UI Emoji & quot;, & quot;Segoe UI Symbol & quot;, & quot;Noto Color Emoji & quot;; white - space - collapse: preserve; ">Dear {{name}},</span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; "><br /></span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; ">We are delighted to inform you that your account has been successfully created on the Central Registrar for Cooperative Societies (CRCS) platform. You can now log in and start the application process to get your society approved and registered.</span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; "><br /></span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; ">To access your account, please visit the CRCS website.</span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; "><br /></span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; ">Once logged in, you will be able to fill out the application form for society registration. Our platform provides a streamlined process to ensure a smooth experience for you.</span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; "><br /></span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; ">If you have any questions or need assistance during the application process, please don't hesitate to reach out to our support team. We are here to help you at every step of the way.</span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; "><br /></span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; ">Thank you for choosing CRCS for your society registration needs. We look forward to serving you.</span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; "><br /></span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve; ">Best regards,</span></span></div><div><span style="font - family: Söhne, ui - sans - serif, system - ui, -apple - system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans - serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; "><span style="white - space - collapse: preserve;">Central Registrar for Cooperative Societies</span></span></div>`
module.exports.sendCreateSocietyEmail = async (data) => {
    console.log(process.env.EMAIL_PASSWORD)
    console.log(data);
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