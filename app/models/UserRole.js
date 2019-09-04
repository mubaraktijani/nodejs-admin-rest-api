'use strict';

require('./Role');
require('./Permission');

const UserRole = Bookshelf.Model.extend({
    tableName: 'user_roles',

    idAttribute: 'user_id',

    permissions() {
        return this.belongsToMany('Permission', 'role_permissions', 'role_id', 'permission_id')
            .query(qb => qb
                .select('permissions.code as name')
            );
    }
});

module.exports = Bookshelf.model('UserRole', UserRole);