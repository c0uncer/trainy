const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({to,subject,html}) =>{
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport(nodemailerConfig);

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        html, // html body
    });
}

module.exports = sendEmail