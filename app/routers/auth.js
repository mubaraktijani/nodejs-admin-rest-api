'use strict';

let router = new(require('restify-router')).Router();
const controller = require('../controller/auth');

router.post({
	path: '/login',
	version: '1.0'
}, controller.v1.login);

router.post({
	path: '/signup',
	version: '1.0'
}, controller.v1.signUp);

module.exports = router;