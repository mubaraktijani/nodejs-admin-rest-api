'use strict';

const Promise = require('bluebird');

const RolePermissions = Bookshelf.Model.extend({
    tableName: 'role_permissions',
    idAttribute: 'role_id'
}, {
    save: Promise.method(function (query) {
        return this.forge(query).save(null, {
            method: 'insert'
        });
    })
});

module.exports = Bookshelf.model('RolePermissions', RolePermissions);