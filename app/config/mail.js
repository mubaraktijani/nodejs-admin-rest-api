'use strict',

require('dotenv').config();

const path = require('path');

module.exports = {
    From: process.env.FROM_EMAIL || 'App Name <no-reply@domain.com>',
    Logo: 'https://bookboon.com/content/images/bookboon.png',
    Path: path.join(__dirname, '..', 'templates'),
    Transport: {
        host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
        port: process.env.SMTP_PORT || 587,
        secure: false, // use TLS
        auth: {
            user: process.env.SMTP_UNAME || 'youremail@domain.com',
            pass: process.env.SMTP_PWORD || '******'
        }
    }
};