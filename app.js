'use strict';

/**
 * Module dependencies.
 * https://github.com/jackfiallos/HotelManagementSystem/blob/master/server/app.js
 */
const app = require('auto-loader').load(__dirname + '/app');
const routes = require('./app/routers');
const Restify = require('restify');
const BunyanToWinston = require('bunyan-winston-adapter');

/**
 * Server
 */
const server = Restify.createServer({
    name        : app.config.app.NAME,
    version     : app.config.app.VERSION,
    acceptable  : app.config.app.ACCEPTABLE,
    log         : BunyanToWinston.createAdapter(app.utils.logger.create(app.config.logging)),
    formatters  : {
        'application/json': app.utils.jsend
    }
});

/**
 * CORS
 */
const cors = require('restify-cors-middleware')({
    preflightMaxAge : 5, //Optional
    origins         : ['*'],
    allowHeaders    : ['Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization, API-Token'],
    exposeHeaders   : ['API-Token-Expiry']
});

/**
 * global variables
 */
global.App = app;
global.Log = app.utils.logger.create(app.config.logging);
global.Config = app.config;
global.Server = server;

/**
 * Set API versioning and allow trailing slashes
 */
const prePlugins = [
    Restify.pre.sanitizePath(),
    require('restify-url-semver')({prefix: '/api'}),
    cors.preflight
];
server.pre(prePlugins);

/**
 * Server plugins
 */
const plugins = [
    Restify.plugins.jsonBodyParser({
        mapParams: true
    }),
    Restify.plugins.acceptParser(server.acceptable),
    Restify.plugins.dateParser(),
    Restify.plugins.queryParser({
        mapParams: true
    }),
    Restify.plugins.fullResponse(),
    Restify.plugins.bodyParser({
        mapParams: false
    }),
    Restify.plugins.gzipResponse(),
    cors.actual,
    //require('./app/middleware/jwt')
];
server.use(plugins);

/**
 * Setup Error Event Handling
 */
app.utils.errorHandler.register(server);

/**
 * Setup route Handling
 */
routes.register(server);

/**
 * Start Server
 */
server.listen(Config.app.PORT, () => {
    console.log(
        '%s v%s ready to accept connections on port %s in %s environment.',
        Config.app.NAME,
        Config.app.VERSION,
        Config.app.PORT,
        Config.app.ENV
    );
});