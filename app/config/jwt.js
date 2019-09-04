'use strict',

require('dotenv').config();

const appName = app.config.core.Name.replace(/\ /g, '-').toLowerCase();

module.exports = {
    Secret: process.env.JWT_ENCRYPTION || 'jwt_please_change',
    Options: {
        algorithm: 'HS256',
        expiresIn: process.env.JWT_EXPIRATION || '10h',
        audience: 'users-' + appName,
        issuer: appName,
        jwtid: 'jwt-' + appName,
        subject: appName,
    },
    WhitelistedRoutes: [
        '/api/v1/auth/login',
        '/api/v1/auth/signup',
        '/api/v1/auth/resend',
        '/api/v1/auth/forgot',
        '/api/v1/subscriptions',
        /^\/api\/v1\/subscriptions\/.*/,
        /^\/api\/v1\/auth\/confirmation\/.*/,
        /^\/api\/v1\/auth\/reset\/.*/,
    ]
};