'use strict',

require('dotenv').config();
const config = require('./core');

module.exports = {
    Name: config.Name,
    File: process.env.LOG_PATH,
    Level: process.env.LOG_LEVEL || 'error',
    Console: process.env.LOG_CONSOLE || true
};