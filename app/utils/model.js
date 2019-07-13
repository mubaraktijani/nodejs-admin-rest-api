'use strict';

const database = require('./database');
const Bookshelf = require('bookshelf')(database);

class PasswordMismatchError extends Error {
    constructor (message) {
        super(message || 'Invalid password');
        this.name = 'PasswordMismatchError';
    }
}

Bookshelf.PasswordMismatchError = PasswordMismatchError;
Bookshelf.Model.PasswordMismatchError = PasswordMismatchError;

/**
 * Enable the `virtuals` plugin to prevent `password` from leaking
 */
Bookshelf.plugin('virtuals');
Bookshelf.plugin('visibility');
Bookshelf.plugin('registry'); // Resolve circular dependencies with relations

module.exports = Bookshelf;