'use strict';

let router = new(require('restify-router')).Router();
const PREFIX = '/api';

module.exports.register = (server) => {

	server.pre((req, _res, next) => {
		console.info(`${req.method} - ${req.url}`);
		next();
	});

	router.add('/auth', require('./auth'));
	router.add('', require('./permission'));
	router.add('', require('./role'));

	router.applyRoutes(server);
};