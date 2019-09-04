'use strict';
const Promise = require('bluebird');

require('./User');
require('./UserRole');
require('./Permission');

const Role = Bookshelf.Model.extend({
    tableName: 'roles',
    
    hasTimestamps: true,

    hidden: [
        'created_at', 'updated_at'
    ],

    users() {
        return this.belongsToMany('User', 'user_roles', 'role_id', 'user_id')
            .query(function (qb) {
                qb.where('user_roles.status', '1');
            });
    },

    permissions() {
        return this.belongsToMany('Permission', 'role_permissions', 'role_id', 'permission_id');
    }
}, {
    save: Promise.method(function (query) {
        return this.forge(query).save(null, {
            method: 'insert'
        });
    })
});

module.exports = Bookshelf.model('Role', Role);