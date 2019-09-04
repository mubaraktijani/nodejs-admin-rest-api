'use strict';

module.exports = (options) => {
    return require('restify-jwt-community')({
        secret: options.Secret,
        credentialsRequired: options.CredentialsRequired,
        userProperty: options.UserProperty || 'auth'
    });
};