'use strict';

require('dotenv').config();

const env = process.env.ENV || 'development';
const config = require('../config/database.js');

module.exports = require('knex')(config[env]);