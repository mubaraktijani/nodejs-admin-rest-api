'use strict';

const database = require('./database');

module.exports = require('bookshelf')(database);