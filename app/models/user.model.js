'use strict';

const Bookshelf = require('./../utils/model');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcryptjs'));
const Config = require('../config');

require ('./role.model');
require ('./user_role.model');

const User = Bookshelf.Model.extend({
    // https://stackabuse.com/Bookshelf-js-a-node-js-orm/
    tableName: 'users',

    hidden: [
        'password', 'remember_token', 'created_at', 'updated_at'
    ],

    role: function () {
        return this.belongsToMany('Role', 'user_roles', 'user_id', 'role_id');
    },

    initialize() {
        this.on('saving', this.hashPassword, this);
    },

    hashPassword(model) {
        return Promise.coroutine(function* () {
            const salt = yield bcrypt.genSaltAsync(Config.APP.SALT_ROUND);
            const hashedPassword = yield bcrypt.hashAsync(model.attributes.password, salt);
            model.set('password', hashedPassword);
        })();
    },

    comparePassword: function(password) {
        return bcrypt
            .compareAsync(password, this.get('password'))
            .then((matches) => {
                if (!matches) throw new this.constructor.PasswordMismatchError();

                return this;
            });
    }
    
}, {
    auth: Promise.method(function(email, password, username = false) {
        let query = null;
        if (username){
            if (!email || !password) throw new Error('username and password are both required');

            query = {
                username: username
            };
        }
        else {
            if (!email || !password) throw new Error('email and password are both required');

            query = {
                email: email
            };
        }

        return this.forge().where(query)
            .fetch({
                withRelated: ['role']
            })
            .then(function (user) {
                if (user) return user.comparePassword(password);
            });
    })
});

module.exports = Bookshelf.model('User', User);