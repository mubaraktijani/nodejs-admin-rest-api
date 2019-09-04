
            


"use strict";

const env = process.env.NODE_ENV || 'development';
const path = require('path');
const config = app.config.mail;
const Nodemailer = require("nodemailer");
const EmailTemplate = require('email-templates');

let emailTemplate = new EmailTemplate({
    message: {
        from: config.From,
        subjectPrefix: env === 'production' ? false : `[${env.toUpperCase()}] `
    },
    send: false,
    preview: false,
    views: {
        options: {
            extension: 'ejs'
        }
    }
});

module.exports.connect = (transport) => {
    transport = (transport) ? transport : config.Transport;
    //transport.connectionTimeout = 4000;

    return Nodemailer.createTransport(transport);
};

exports.sendMail = (mailOptions, callback) => {
    emailTemplate.transport = this.connect();

    if (mailOptions.template) {
        let sender = config.From.split(' ');
        sender = sender[sender.length - 1].replace('<', '').replace('>', '');

        mailOptions.locals.logo = config.Logo;
        mailOptions.locals.sender = sender;
        mailOptions.locals.web_domain = app.config.core.WebDomain.replace('http://', '').replace('www', '');

        const emailOptions = {
            template: path.join(config.Path, mailOptions.template),
            message: mailOptions.message,
            locals: mailOptions.locals,
        };

        return emailTemplate
            .send(emailOptions)
            .then(info => callback(null, info))
            .catch(error => {
                Log.error(error);
                callback(error, null);
            });
    }

    return emailTemplate.transport.sendMail(mailOptions, (err, info) => {
            if (err) Log.error(err);
            callback(err, info);
        });
};