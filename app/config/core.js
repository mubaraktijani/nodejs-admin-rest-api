'use strict';

module.exports = {
    Name: 'admin-panel-api',
    Port: process.env.PORT || 3000,
    Env: process.env.NODE_ENV || 'development',
    Version: process.env.VERSION || '1.0.0',
    LogLevel: process.env.LOG_LEVEL || 'info',
    WebDomain: process.env.WEB_DOMAIN || 'projectsmeter.com',
    Acceptable: ['application/json'],
    ThrottleRate: 50,
    ThrottleBurst: 100,
    SaltRound: 12,
};