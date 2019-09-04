'use_strict';

const crypto = require('crypto');
const Mailer = app.utils.mailer;

const Token = app.models.Token;
const PasswordReset = app.models.PasswordReset;

exports.sendAccountVerification = (userObj, callback) =>
    Token.save({
        user_id: userObj.id,
        token: crypto.randomBytes(16).toString('hex')
    })
    .then(token => {
        if (!token) return callback(new Error('Couldn\'t generate token.'));

        // Send the email
        var mailOptions = {
            template: 'AccountVerification',
            message: {
                to: userObj.email,
                subject: 'Account Verification Token',
            },
            locals: {
                username: userObj.username,
                name: userObj.name,
                token: `/confirmation/${token.get('token')}`
            }
        };

        Mailer.sendMail(mailOptions, () => callback());
    });

exports.sendForgotPassword = (userObj, callback) =>
    PasswordReset.save({
        user_id: userObj.id,
        token: crypto.randomBytes(16).toString('hex')
    })
    .then(passwordReset => {
        if (!passwordReset) return callback(new Error('Couldn\'t generate token.'));
        // Send the email
        Mailer.sendMail({
            template: 'ResetPassword',
            message: {
                to: userObj.email,
                subject: 'Password Reset Confirmation'
            },
            locals: {
                username: userObj.username,
                name: userObj.name,
                token: `/reset/${passwordReset.toJSON().token}`
            }
        }, () => callback());
    });