'use strict';

const httpErr = require('restify-errors');
const JWT = require('jsonwebtoken');
const _JWT = require('./../config').JWT;

module.exports = require('restify-jwt-community')({
    secret: _JWT.ENCRYPTION,
    //requestProperty: 'auth',
    credentialsRequired: false,
    getToken: (req) => {
        if (req.headers.authorization) {
            const bearer = req.headers.authorization.split(' ');
            
            if (bearer.length === 2) {
                const token = bearer[1];

                JWT.verify(token, _JWT.ENCRYPTION, (err, auth) => {

                    if (err) {
                        return (err.name === 'TokenExpiredError') ?
                            new httpErr.UnauthorizedError('The token has expired') :
                            new httpErr.InvalidCredentialsError(err);
                    }

                    try {
                        req.jwt = {};
                        req.jwt.secret = _JWT.ENCRYPTION;
                        req.jwt.token = token;
                        req.jwt.auth = JWT.decode(token, _JWT.DECODE) || {};
                        return null;
                    } catch (e) {
                        return new httpErr.InvalidCredentialsError('The token is corrupted');
                    }
                });

            } else {
                return new httpErr.InvalidCredentialsError('Format is Authorization: Bearer [token]');
            }
        } else {
            return new httpErr.InvalidCredentialsError('No authorization token was foundgggg');
        }
    }
}).unless({
    path: _JWT.WHITELISTED_ROUTES
});