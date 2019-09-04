'use strict';

/**
 * Module dependencies.
 * https://github.com/jackfiallos/HotelManagementSystem/blob/master/server/app.js
 */

const app = require('auto-loader').load(__dirname + '/app');
const path = require('path');
const auth = require('express-rbac');
const Routes = require('./app/routes');
const Restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const BunyanToWinston = require('bunyan-winston-adapter');

let Router = new (require('restify-router')).Router();

/**
 * Server
 */
const server = Restify.createServer({
    name: app.config.core.Name,
    version: app.config.core.Version,
    acceptable: app.config.core.Acceptable,
    log: BunyanToWinston.createAdapter(app.utils.logger.create(app.config.logging)),
    formatters: {
        'application/json': app.utils.jsend
    }
});

/**
 * global variables
 */
global.app = {
    log: app.utils.logger.create(app.config.logging),
    utils: app.utils,
    config: app.config,
    server: server,
    models: app.models,
    routers: app.routers,
    controllers: app.controller,
};
global.Bookshelf = app.utils.model;
global.Log = app.utils.logger.create(app.config.logging);
global.Auth = auth;

/**
 * Set API versioning and allow trailing slashes
 */
const prePlugins = [
    Restify.pre.sanitizePath(),
    require('restify-url-semver')({ prefix: '/api' }),
];
server.pre(prePlugins);

/**
 * Server plugins
 */
const throttleOptions = {
    rate: app.config.core.ThrottleRate,
    burst: app.config.core.ThrottleBurst,
    ip: false,
    username: true
};

const plugins = [
    //compression(), // compress all responses
    Restify.plugins.throttle(throttleOptions),
    Restify.plugins.acceptParser(server.acceptable), // Accept header
    Restify.plugins.dateParser(), // expires requests based on current time + delta
    Restify.plugins.authorizationParser(), // Authorization header
    Restify.plugins.jsonBodyParser({
        mapParams: true
    }), // parses JSON POST bodies to req.body
    Restify.plugins.queryParser({
        mapParams: true
    }), // Parses URL query paramters into req.query
    Restify.plugins.bodyParser({
        mapParams: true
    }), // parses POST bodies to req.body
    Restify.plugins.fullResponse(),
    Restify.plugins.gzipResponse(), // gzips the response if client accepts it
    app.middleware.verifyJWT(app.config.jwt).unless({
        path: app.config.jwt.WhitelistedRoutes
    }),
    //app.middleware.rbac,
];
server.use(plugins);
server.use(app.middleware.rbac);

/**
 * CORS
 */
const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: ['Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization, API-Token'],
    exposeHeaders: ['API-Token-Expiry']
});
server.pre(cors.preflight);
server.use(cors.actual);

/**
 * Request / Response Logging
 */
server.on('after', (req, res, err, next) => {
    Restify.plugins.auditLogger({
        event: 'after',
        log: Log
    });
});

/**
 * Setup Error Event Handling
 */
app.utils.errorHandler(server);

/**
 * Setup route Handling
 */
server.pre((req, _res, next) => {
    if (app.config.core.Env === 'developmen') Log.info(`${req.method} - ${req.url}`);
    next();
});
Routes.forEach(route => {
    const controllerPath = path.join(__dirname, 'app', 'controller');
    
    if (typeof route === 'object') {
        const prefix = (route.prefix) ? route.prefix : '';
        
        Router.add(prefix, require(path.join(controllerPath, route.controller)));
    } else {
        Router.add('', require(path.join(controllerPath, route)));
    }
});
Router.applyRoutes(server);

/**
 * Start Server
 */
const listen = (done) => server.listen(app.config.core.Port, '0.0.0.0', () => {
    if (done) return done();

    Log.info(
        '%s v%s ready to accept connections on port %s in %s environment.',
        app.config.core.Name,
        app.config.core.Version,
        server.url, // app.config.core.Port,
        app.config.core.Env
    );
});

if (!module.parent) listen();

module.exports = server;