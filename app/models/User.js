'use strict';

require('./Role');
require('./UserRole');

const config = require('../config/core');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcryptjs'));
const crypto = require('crypto');

const Token = require('./Token');
const PasswordReset = require('./PasswordReset');

const User = Bookshelf.Model.extend({
    // https://stackabuse.com/Bookshelf-js-a-node-js-orm/
    tableName: 'users',

    hidden: [
        'password', 'remember_token', 'created_at', 'updated_at', 'role.user_id', 'role.role_id',
        'role.created_at', 'role.updated_at'
    ],

    role: function () {
        return this.hasOne('UserRole')
            .query(qb => qb
                .select('roles.*', 'user_roles.*')
                .innerJoin('roles', 'roles.id', 'user_roles.role_id')
            );
    },

    token: function () {
        return this.hasOne('Token', 'user_id');
    },

    passwordReset: function () {
        return this.hasOne('PasswordReset', 'user_id');
    },

    initialize() {
        this.on('saving', this.hashPassword, this);
    },

    hashPassword(model) {
        return Promise.coroutine(function* () {
            if (model.attributes.password.length <= 30) {
                const salt = yield bcrypt.genSaltAsync(config.SALT_ROUND);
                const hashedPassword = yield bcrypt.hashAsync(model.attributes.password, salt);
                model.set('password', hashedPassword);
            }
        })();
    },

    comparePassword: function (password) {
        return bcrypt
            .compareAsync(password, this.get('password'))
            .then(matches => {
                if (!matches) throw new this.constructor.PasswordMismatchError();
                return this;
            });
    }

}, {

    save: Promise.method(function (query) {
        return this.forge(query).save(null, {
            method: 'insert'
        });
    }),

    auth: Promise.method(function (username, password) {

        const email_regx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!username || !password) throw new Error('username and password are both required');

        const query = (email_regx.test(username)) ? {
            email: username
        } : {
            username: username
        };

        return this.forge().where(query)
            .fetch({
                require: true,
                withRelated: ['role']
            })
            .then(function (user) {
                if (user) return user.comparePassword(password);
                return user;
            });
    }),

    create: Promise.method(function (query) {
        const self = this;
        return self
            .where('email', query.email)
            .orWhere('username', query.username)
            .fetch()
            .then(function (user) {
                if (user) return undefined;

                return self.forge(query)
                    .save(null, {
                        method: 'insert'
                    })
                    .then(function (user) {
                        if (!user) return undefined;

                        // Create a verification token for this user
                        return Token.save({
                                user_id: user.get('id'),
                                token: crypto.randomBytes(16).toString('hex')
                            })
                            .then(token => {
                                if (!token) return undefined;

                                user = user.toJSON();
                                user.token = token.get('token');

                                return user;
                            });
                    });
            });
    }),

    token: Promise.method(function (email) {
        return this.forge().where('email', email)
            .fetch({
                withRelated: ['token']
            })
            .then(function (user) {
                return user;
            });
    }),

    passwordReset: Promise.method(function (email) {
        return this.forge().where('email', email)
            .fetch({
                withRelated: ['passwordReset']
            })
            .then(function (user) {
                return user;
            });
    }),

    resetPassword: Promise.method(function (token, password) {
        const self = this;
        return PasswordReset.where('token', token).fetch().then(function (passwordReset) {
            if (!passwordReset) return passwordReset;

            return self.where('id', passwordReset.toJSON().user_id).fetch().then(function (user) {
                // update password and remeber_token, and send email
                user.set('password', password);

                return user.save().then(() => {
                    return user;
                });
            });

        });
    })
});

module.exports = Bookshelf.model('User', User);