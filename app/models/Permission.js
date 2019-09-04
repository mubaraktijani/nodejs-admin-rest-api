'use strict';
const Promise = require('bluebird');

const Permission = Bookshelf.Model.extend({
    tableName: 'permissions',

    hidden: [
        'created_at', 'updated_at', '_pivot_role_id', '_pivot_permission_id'
    ],

    role() {
        return this.belongsToMany('Role', 'role_permissions', 'permission_id', 'role_id');
    }
}, {
    save: Promise.method(function (query) {
        return this.forge(query).save(null, {
            method: 'insert'
        });
    })
});

module.exports = Bookshelf.model('Permission', Permission);