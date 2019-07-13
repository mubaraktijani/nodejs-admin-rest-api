'use strict',

require('dotenv').config();
const app = require('./app');

const parseName = (name) => {
    return name.replace(/\ /g, ".").toLowerCase();
}

const OPTIONS = {
    algorithm   : 'HS256',
    expiresIn   : process.env.JWT_EXPIRATION || '10h',
    audience    : 'users.api.' + parseName(app.NAME),
    issuer      : 'api.' + parseName(app.NAME),
    jwtid       : 'jwt.api.' + parseName(app.NAME),
    subject     : parseName(app.NAME),
}

module.exports = {

    ENCRYPTION          : process.env.JWT_ENCRYPTION || 'jwt_please_change',
    
    OPTIONS             : OPTIONS,

    DECODE              : {
        complete        : true,
        json            : true,
    },

    WHITELISTED_ROUTES  : [
        '/api/auth/login',
        '/api/auth/signup'
    ]
};