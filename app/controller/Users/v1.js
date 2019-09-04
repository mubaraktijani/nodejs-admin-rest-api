'use_strict';

const Mail = require('../Auth/mails');
const httpErr = require('restify-errors');
const Validator = require('./validator');

const User = app.models.User;
const Role = app.models.Role;
const UserRole = app.models.UserRole;

exports.users = (req, res) => {
    const user_id = req.params.user_id;
    const enabled = (req.getRoute().path === '/users/disabled') ? false : true;

    const msg = (enabled) ? 'No User has been Created or Enabled.' : 'No User has been Disabled!';

    if (user_id)
        return User.where('id', user_id)
            .fetch({
                withRelated: ['role']
            })
            .then(user => {
                if (!user)
                    return res.json(new httpErr.NotFoundError('User not Found.'));
                res.json(user);
            });

    User.where('enabled', enabled).fetchAll({
            withRelated: ['role']
        })
        .then(users => {
            if (!users)
                return res.json(msg);
            res.json(users);
        });
};

exports.create = (req, res) => {
    Validator.create.validate(req.params, (err, params) => {
        if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

        // Create and save the user
        return User.create({
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password
        }).then(user => {
            if (!user) return res.json('The email address you have entered is already associated with another account.');

            // Send the email
            Mail.sendAccountVerification(user, error => {
                if (error)
                    return res.json(new httpErr.InternalServerError(error.message));
                
                if (app.config.core.Env === 'test') return res.json(user);

                res.json(`A verification email has been sent to ${user.email}.`);
            });
        }).catch((err) => {
            Log.error(err);
            res.json(new httpErr.InternalServerError("Couldn't create your Account. Please try again!"));
        });
    });
};

exports.update = (req, res) => {
    Validator.update.validate(req.params, (err, params) => {
        if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

        const {
            user_id,
            name,
            username,
            email,
            role_id,
        } = params;

        User.where('id', user_id)
            .fetch()
            .then(user => {
                if (!user) return res.json(new httpErr.NotFoundError('User Not Found!'));

                let isVerified = true;

                // change name if set
                user.set('name', (!name) ? user.get('name') : name);
                
                // change username if set
                user.set('username', (!username) ? user.get('username') : username);

                // change email if set and verify the email
                if (email && email !== user.get('email')) {
                    isVerified = false;
                    user.set('email', email);
                    user.set('isVerified', isVerified);
                }

                // save changes
                return user.save().then(updates => {
                    
                    //check if user email is not verified, Create a verification token for this user
                    if (!isVerified)
                        return Mail.AccountVerification({
                            id: user_id,
                            name: name,
                            email: email,
                            username: username
                        }, (error) => {
                            if (error)
                                return res.json(new httpErr.InternalServerError(error.message));

                            res.json(`A verification email has been sent to ${user.email}.`);
                        });

                    

                    res.json('User Updated successfully.');
                });
            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't update Role. Please try again!"));
            });

    });
};

exports.delete = (req, res) => {
    Validator.userId.validate(req.params, (err, params) => {
        if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));
        
        User.where('id', params.user_id)
            .fetch()
            .then(user => {
                if (!user) return res.json(new httpErr.NotFoundError('User Not Found!'));

                return user.destroy().then(() => res.json('User Deleted successfuly!'));
            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't delete Role. Please try again!"));
            });
    });
};

exports.enable = (req, res) => {
    Validator.userId.validate(req.params, (err, params) => {
        if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

        User.where('id', params.user_id)
            .fetch()
            .then(user => {
                if (!user) return res.json(new httpErr.NotFoundError('User Not Found!'));

                user.set('enabled', true);

                return user.save().then(() => res.json('User enabled successfuly!'));
            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't delete Role. Please try again!"));
            });
    });
};

exports.disable = (req, res) => {
    Validator.userId.validate(req.params, (err, params) => {
        if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

        User.where('id', params.user_id)
            .fetch()
            .then(user => {
                if (!user) return res.json(new httpErr.NotFoundError('User Not Found!'));

                user.set('enabled', false);

                return user.save().then(() => res.json('User disabled successfuly!'));
            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't delete Role. Please try again!"));
            });
    });
};

exports._assignUserRole = (role_id, user_id, callback) => {
    return Role.where('id', role_id).fetch()
        .then(role => {
            if (!role) return new Error('Role Not Found!');

            return UserRole.forge({
                user_id: user_id,
                role_id: role_id,
                status: 1
            }).save().then(() => callback());
        });
};