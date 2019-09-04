'use strict';
const Promise = require('bluebird');

const PasswordReset = Bookshelf.Model.extend({
    tableName: 'password_resets',
    idAttribute: 'user_id'
}, {
    save: Promise.method(function (query) {
        return this.forge(query).save(null, {
            method: 'insert'
        });
    })
});

module.exports = Bookshelf.model('PasswordReset', PasswordReset);