'use strict';

module.exports.register = (server) => {
    var httpErr = require('restify-errors');

    server.on('NotFound', (req, res) => {
        res.send(
            new httpErr.NotFoundError('Method not Implemented')
        );
    });

    server.on('VersionNotAllowed', (req, res) => {
        res.send(
            new httpErr.HttpVersionNotSupportedError('Unsupported API version requested')
        );
    });

    server.on('InvalidVersion', (req, res) => {
        res.send(
            new httpErr.InvalidVersionError('Unsupported API version requested')
        );
    });

    server.on('MethodNotAllowed', (req, res) => {
        res.send(
            new httpErr.MethodNotAllowedError('Method not Implemented')
        );
    });

    server.on('restifyError', (req, res, err, error) => {
        res.send(
            new httpErr.InternalServerError(error)
        );
    });

    /**
     * Emitted when some handler throws an uncaughtException somewhere in the chain. 
     * The default behavior is to just call res.send(error), and let the built-ins in restify 
     * handle transforming, but you can override to whatever you want here.
     */
    server.on('uncaughtException', (req, res, route, error) => {
        res.send(
            new httpErr.InternalError(error)
        );
    });
};