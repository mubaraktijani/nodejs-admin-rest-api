'use strict';

const Bookshelf = require('./../utils/model');;

const UserRole = Bookshelf.Model.extend({
    tableName: 'user_roles',
});

module.exports = Bookshelf.model('UserRole', UserRole);