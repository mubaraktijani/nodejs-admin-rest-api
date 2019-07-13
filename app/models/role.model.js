'use strict';

const Bookshelf = require('./../utils/model');

require('./user.model');
require('./user_role.model');

require('./permission.model');

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
});

module.exports = Bookshelf.model('Role', Role);