const nodemailer = require('nodemailer')

let mailer = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: '441595692051-uv0muvoiqub05rvl0l7a4vfta92hhbul.apps.googleusercontent.com',
        clientSecret: '3VxWYtpw3uLLXCjM5JVRxtz4'
    }
});

module.exports = mailer