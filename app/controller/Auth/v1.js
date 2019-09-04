const jwt = require('jsonwebtoken');
const Mail = require('./mails');
const httpErr = require('restify-errors');
const Validator = require('./validator');

const User = app.models.User;
const Token = app.models.Token;
const PasswordReset = app.models.PasswordReset;

module.exports = {
    /**
     * Sign in with a given email, password combination
     * @param {username, password}
     */
    login: (req, res) => {

        Validator.login.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

            const {
                username,
                password
            } = params;

            User.auth(username, password).then(user => {
                // Make sure the user has been verified
                if (!user.get('isVerified'))
                    return res.json(new httpErr.UnauthorizedError('Your account has not been verified.'));
                
                user = user.toJSON();

                // Login successful, generate token and send back user
                const token = jwt.sign(user, app.config.jwt.Secret, app.config.jwt.Options);

                return res.json({
                    data: user,
                    token: `Bearer ${token}`
                });

            }).catch(User.PasswordMismatchError, () => {
                res.json(new httpErr.InvalidCredentialsError("Invalid password. Please try again!"));

            }).catch(User.NotFoundError, () => {
                res.json(new httpErr.InvalidCredentialsError("Invalid username or password. Please try again!"));

            }).catch(err => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't find your Account. Please try again!"));
            });
        });

    },

    /**
     * Sign up a new user.
     * @param {name, username, email, password}
     */
    signUp: (req, res) => {

        Validator.signup.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.InvalidCredentialsError(err.details[0].message));

            const {
                name,
                email,
                password
            } = params;

            // get username by spliting email if username is not set
            const username = (!params.username) ? email.split('@')[0] : params.username;

            // Make sure user doesn't already exist
            User.where('email', email).orWhere('username', username).fetch().then((data) => {
                if (data)
                    return res.json('The email address you have entered is already associated with another account.');

                // Create and save the user
                return User.save({
                        name: name,
                        username: username,
                        email: email,
                        password: password
                    })
                    .then(user =>
                        Mail.sendAccountVerification(user, error => {
                            if (error)
                                return res.json(new httpErr.InternalServerError(error.message));

                            res.json(`A verification email has been sent to ${user.email}.`);
                        })
                    );
            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't create your Account. Please try again!"));
            });
        });
    },

    /**
     * Resend Sign up email confirmation token.
     * @param {email}
     */
    resendToken: (req, res) => {
        Validator.resend.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.InvalidCredentialsError(err.details[0].message));

            User.where('email', params.email).fetch().then(user => {
                if (!user) return res.json(
                    new httpErr.NotFoundError('We were unable to find a user with that email.'));

                user = user.toJSON();

                if (user.isVerified)
                    return res.json('This account has already been verified. Please log in.');
                

                return Mail.sendAccountVerification(user, error => {
                    if (error)
                        return res.json(new httpErr.InternalServerError(error.message));

                    res.json(`A verification email has been sent to ${user.email}.`);
                });

            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't resend your Account. Please try again!"));
            });
        });
    },

    /**
     * Sign up email confirmation.
     * @param {token, email}
     */
    confirmation: (req, res) => {
        Validator.confirmation.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.InvalidCredentialsError(err.details[0].message));

            const {
                token,
                email
            } = params;

            // Find a matching token
            User.token(email).then(user => {
                // check if user has been verified
                if (user !== undefined && user.toJSON().isVerified)
                    return res.json('This user has already been verified.');
                
                // verify the token provided
                if (!user || user.toJSON().token === token)
                    return res.json(new httpErr.NotFoundError(
                        'We were unable to find a valid token. Your token may have expired.'
                    ));

                // Verify and update the user
                user.set('isVerified', true);
                return user.save().then(user => {
                    // remove token
                    Token.where('user_id', user.toJSON().id).fetchAll().then(collection => {
                        collection.each(it => it.destroy());
                        
                        res.json('The account has been verified. Please log in.');
                    });
                });
            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't create your Account. Please try again!"));
            });
        });
    },

    /**
     * Send a reset link to the given user.
     *
     * @param  {email}
     */
    forgotPassword: (req, res) => {
        Validator.forgotPassword.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.InvalidCredentialsError(err.details[0].message));

            User.where('email', params.email).fetch().then(user => {
                if (!user) return res.json(new httpErr.NotFoundError('We were unable to find a user with that email.'));

                return Mail.sendForgotPassword(
                    user.toJSON(),
                    (error) => {
                        if (error) return res.json(new httpErr.InternalServerError(error.message));
                        res.json(
                            'An e-mail has been sent to ' + user.toJSON().email + ' with further instructions.'
                        );
                    }
                );

            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't reset your Account Password. Please try again!"));
            });
        });
    },

    /**
     * Update the user's password.
     *
     * @param  {token, password}
     */
    updatePassword: (req, res) => {
        Validator.passwordReset.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.InvalidCredentialsError(err.details[0].message));

            // update password and send email
            return User.resetPassword(params.token, params.password).then(user => {
                if (!user) return res.json(new httpErr.NotFoundError('Password reset token is invalid or has expired.'));

                user = user.toJSON();

                //subject: 'Your password has been changed'
                //sendMail: 'Hello, This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                
                // remove token
                PasswordReset.where('user_id', user.id).fetchAll().then(c => {
                    c.each(it => it.destroy());
                    res.json('Your password has been changed.');
                });
            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't reset your Account Password. Please try again!"));
            });
        });
    }
};