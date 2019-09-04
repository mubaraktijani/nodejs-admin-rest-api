'use strict';

const Promise = require('bluebird');

const Token = Bookshelf.Model.extend({
    tableName: 'tokens',
    idAttribute: 'user_id'
}, {
    save: Promise.method(function (query) {
        return this.forge(query).save(null, {
            method: 'insert'
        });
    })
});

module.exports = Bookshelf.model('Token', Token);