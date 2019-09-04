'use strict';

let Route = new(require('restify-router')).Router();
const v1 = require('./v1');

Route.post({
    path: '/login',
    version: '1.0'
}, v1.login);

Route.post({
    path: '/signup',
    version: '1.0'
}, v1.signUp);

Route.post({
    path: '/confirmation/:token',
    version: '1.0'
}, v1.confirmation);

Route.post({
    path: '/resend',
    version: '1.0'
}, v1.resendToken);

Route.post({
    path: '/forgot',
    version: '1.0'
}, v1.forgotPassword);

Route.post({
    path: '/reset/:token',
    version: '1.0'
}, v1.updatePassword);

module.exports = Route;