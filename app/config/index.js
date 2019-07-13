'use strict',

require('dotenv').config();

// this will be used to prefix route paths.
// a workaround since restify does not have this yet
const API_ROOT  = '/api';

module.exports = {
    APP             : require('./app'),
    
    JWT             : require('./jwt'),

    DB              : require('./database'),

    LOGGING         : {
        file        : process.env.LOG_PATH,
        level       : process.env.LOG_LEVEL || 'info',
        console     : process.env.LOG_ENABLE_CONSOLE || true
    }
};