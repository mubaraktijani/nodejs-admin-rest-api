'use strict';

const Bookshelf = require('./../utils/model');;

const Permission = Bookshelf.Model.extend({
    tableName: 'permissions'
});

module.exports = Bookshelf.model('Permission', Permission);