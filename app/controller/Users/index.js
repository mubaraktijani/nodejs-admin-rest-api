'use strict';

let Route = new(require('restify-router')).Router();
const v1 = require('./v1');

Route.get({
        path: '/users',
        version: '1.0'
    },
    Auth.hasAnyPermission([
        'read_admin', 'read_auth_users',
        'create_admin',
    ]),
    v1.users
);

Route.get({
        path: '/users/disabled',
        version: '1.0'
    },
    Auth.hasAnyPermission([
        'read_admin', 'read_auth_users',
        'create_admin',
    ]),
    v1.users
);

Route.get({
        path: '/user/:user_id',
        version: '1.0'
    },
    Auth.hasAnyPermission([
        'read_admin', 'read_auth_users',
        'create_admin',
    ]),
    v1.users
);

Route.post({
        path: '/user',
        version: '1.0'
    },
    Auth.hasAnyPermission([
        'create_auth_users',
        'create_admin',
    ]),
    v1.create
);

/**
 * Update User Information: PUT /role/{rol_uid}
 */
Route.put({
        path: '/user/:user_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'update_auth_users',
        'create_admin'
    ]),
    v1.update
);

Route.del({
        path: '/user/:user_id',
        version: '1.0'
    },
    Auth.hasAnyPermission([
        'delete_auth_users',
        'create_admin',
    ]),
    v1.delete
);

Route.post({
        path: '/user/:user_id/disable',
        version: '1.0'
    },
    Auth.hasAnyPermission([
        'create_auth_users',
        'update_auth_users',
        'delete_auth_users',
        'create_admin',
    ]),
    v1.disable
);

Route.post({
        path: '/user/:user_id/enable',
        version: '1.0'
    },
    Auth.hasAnyPermission([
        'create_auth_users',
        'update_auth_users',
        'delete_auth_users',
        'create_admin',
    ]),
    v1.enable
);

module.exports = Route;