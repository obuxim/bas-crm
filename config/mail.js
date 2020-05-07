const nodemailer = require('nodemailer')
const config = require('config')

const email = config.get('gmail_email')
const password = config.get('gmail_password')

let mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: password
    }
});

module.exports = mailer