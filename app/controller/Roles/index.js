'use strict';

let Route = new(require('restify-router')).Router();
const v1 = require('./v1');

/**
 * Get Roles List: GET /roles
 */
Route.get({
        path: '/roles',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_roles',
        'read_admin', 'read_auth_roles',
        'update_auth_roles',
        'delete_auth_roles',

        'create_admin',
    ]),
    v1.get
);


/**
 * Get Role Information: GET /role/{rol_uid}
 */
Route.get({
        path: '/role/:role_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_roles',
        'read_admin', 'read_auth_roles',
        'update_auth_roles',
        'delete_auth_roles',

        'create_admin',
    ]),
    v1.get
);

/**
 * Create Role: POST /role
 */
Route.post({
        path: '/role',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_roles',
        'create_admin'
    ]),
    v1.create
);


/**
 * Update Role: PUT /role/{rol_uid}
 */
Route.put({
        path: '/role/:role_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'update_auth_roles',
        'create_admin'
    ]),
    v1.update
);


/**
 * Delete Role: DELETE /role/{rol_uid}
 */
Route.del({
        path: '/role/:role_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'delete_auth_roles',
        'create_admin'
    ]),
    v1.delete
);


/**
 * Get Users with Role: GET /role/{rol_uid}/users
 */
Route.get({
        path: '/role/:role_id/users',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_roles',
        'read_admin', 'read_auth_roles',
        'update_auth_roles', 
        'delete_auth_roles',

        'create_admin',
    ]),
    v1.users
);


/**
 * Available Users for Role: GET /role/{rol_uid}/available-users
 * coming soon
 */

/**
 * Assign User to Role: POST /role/{rol_uid}/user
 */
Route.post({
        path: '/role/:role_id/user',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_roles',
        'update_auth_roles',
        'delete_auth_roles',

        'create_admin'
    ]),
    v1.addUser
);


/**
 * Unassign User from Role: DELETE /role/{rol_uid}/user/{usr_uid}
 */
Route.del({
        path: '/role/:role_id/user',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_roles',
        'update_auth_roles',
        'delete_auth_roles',

        'create_admin',
    ]),
    v1.deleteUser
);

/**
 * Permissions List for Role: GET /role/{rol_uid}/permissions
 */
Route.get({
        path: '/role/:role_id/permissions',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_roles',
        'read_admin', 'read_auth_roles',
        'update_auth_roles',
        'delete_auth_roles',

        'create_admin'
    ]),
    v1.permissions
);


/**
 * Available Permissions for Role: GET /role/{rol_uid}/available-permissions
 * coming soon
 */


/**
 * Assign Permission to Role: POST /role/{rol_uid}/permission
 */
Route.post({
        path: '/role/:role_id/permission',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_roles',
        'update_auth_roles',
        'delete_auth_roles',

        'create_admin'
    ]),
    v1.assignPermission
);


/**
 * Unassign Permission from Role: DELETE /role/{rol_uid}/permission/{per_uid}
 */
Route.del({
        path: '/role/:role_id/permission',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_auth_roles',
        'update_auth_roles',
        'delete_auth_roles',

        'create_admin',
    ]),
    v1.revokePermission
);

module.exports = Route;