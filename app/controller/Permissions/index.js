'use strict';

let Route = new(require('restify-router')).Router();
const v1 = require('./v1');

/**
 * Get Permission List: GET /permissions
 */
Route.get({
        path: '/permissions',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_permissions',
        'read_admin', 'read_auth_permissions',
        'update_auth_permissions',
        'delete_auth_permissions',
        'create_admin'
    ]),
    v1.get
);


/**
 * Get Permission Information: GET /permission/:perm_id
 * coming soon
 */
Route.get({
        path: '/permission/:perm_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_permissions',
        'read_admin', 'read_auth_permissions',
        'update_auth_permissions',
        'delete_auth_permissions',
        'create_admin'
    ]),
    v1.get
);

/**
 * Create Permission: POST /role
 */
Route.post({
        path: '/permission',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_permissions',
        'create_admin'
    ]),
    v1.create
);


/**
 * Update Permission: PUT /role/:perm_id
 */
Route.put({
        path: '/permission/:perm_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'update_auth_permissions',
        'create_admin'
    ]),
    v1.update
);


/**
 * Delete Permission: DELETE /role/:perm_id
 */
Route.del({
        path: '/permission/:perm_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'delete_auth_permissions',
        'create_admin'
    ]),
    v1.delete
);


module.exports = Route;