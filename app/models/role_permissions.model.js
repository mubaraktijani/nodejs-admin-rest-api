'use strict';

const Bookshelf = require('./../utils/model');;

const RolePermissions = Bookshelf.Model.extend({
    tableName: 'role_permissions',
});

module.exports = Bookshelf.model('RolePermissions', RolePermissions);