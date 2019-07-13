'use strict';

// this will be used to prefix route paths.
// a workaround since restify does not have this yet
const API_ROOT  = '/api';

module.exports = {
    NAME            : 'admin-panel-api',
    ENV             : process.env.ENV || 'development',
    PORT            : process.env.PORT  || '3000',
    VERSION         : process.env.VERSION || '1.0.0',
    
    LOG_LEVEL       : process.env.LOG_LEVEL || 'info',

    ACCEPTABLE      : [ "application/json" ],

    THROTTLE_RATE   : 50,
    THROTTLE_BURST  : 100,

    SALT_ROUND      : 12,

    // will be used to building route paths
    basePath        : (path) => API_ROOT.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
};