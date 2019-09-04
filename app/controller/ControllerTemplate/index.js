'use strict';

let Route = new(require('restify-router')).Router();
const v1 = require('./v1');

/**
 * Get Roles List: GET /roles
 */
Route.get({
        path: '/template',
        version: '1.0',
    },
    Auth.hasPermission('template'),
    v1.get
);

module.exports = Route;