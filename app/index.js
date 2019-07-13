'use strict',
require('dotenv').config();

// this will be used to prefix route paths.
// a workaround since restify does not have this yet
const API_ROOT  = '/api';

module.exports = {
    //Utils       : require('./utils'),
    Config      : require('./config'),
    //Models      : require('auto-loader').load(__dirname + '/models'),
    //Routers     : require('./routers'),
    //Controller  : require('auto-loader').load(__dirname + '/controller'),
    //Middleware  : require('./middleware')
};