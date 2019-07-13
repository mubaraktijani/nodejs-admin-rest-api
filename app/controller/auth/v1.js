const _       = require('lodash')
const httpErr = require('restify-errors');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const User = require('../../models/user.model');
const Validator = require('./validator');

module.exports = {
    /**
     * Sign in with a given email, password combination
     *
     * @returns {Promise.<Auth>} A promise resolving to the authenticated Auth, or rejected with a `PasswordMismatchError`.
     */
    login: (req, res) => {

        Validator.loginByEmail.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));
            
            const {email, password} = params;

            User.auth(email, password).then((user) => {
                let data = user.toJSON();
                data.role = data.role[0];

                const token = jwt.sign(data, Config.JWT.ENCRYPTION, Config.JWT.OPTIONS);
                return res.json({success: true, token: `JWT ${token}`});

            }).catch(User.PasswordMismatchError, () => {
                res.json(new httpErr.InvalidCredentialsError("Invalid password. Please try again!"));

            }).catch(User.NotFoundError, () => {
                res.json(new httpErr.InvalidCredentialsError("Invalid username or password. Please try again!"));

            }).catch(err => {
                log.error(err.message);
                res.json(new httpErr.InternalServerError("Couldn't find your Account. Please try again!"));
            });
        });

    },

    /**
     * Sign up a new user.
     *
     * @returns {Promise.<Auth>} A promise resolving to the newly registered Auth, or rejected with an error.
     */
    signUp: (req, res, next) => {

        Validator.signup.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.InvalidCredentialsError(err.details[0].message));

            const {name, email, password} = params;

            User.where('email', email).fetch().then((data) => {
                if (data) return res.json(new httpErr.InvalidCredentialsError('User Already exists!'));

                var user = new User();  
                user.set('name', name);  
                user.set('email', email);
                user.set('password', password);

                user.save().then((user) => {
                    let data = user.toJSON();
                    data.role = data.role[0];

                    const token = jwt.sign(data, Config.JWT.ENCRYPTION, Config.JWT.OPTIONS);
                    return res.json({success: true, token: `JWT ${token}`});
                });

            }).catch((err) => {
                log.error(err.message);
                res.json(new httpErr.InternalServerError("Couldn't create your Account. Please try again!"));
            });
        });
    }

};