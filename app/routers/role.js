'use strict';

let router = new(require('restify-router')).Router();
const controller = require('../controller/role');

//https://wiki.processmaker.com/3.1/REST_API_Administration/Roles#Assign_Permission_to_Role:_POST_.2Frole.2F.7Brol_uid.7D.2Fpermission
/**
 * Get Roles List: GET /roles
 */
router.get({
	path: '/roles',
	version: '1.0',
}, controller.v1.get);


/**
 * Get Role Information: GET /role/{rol_uid}
 * coming soon
 */
router.get({
	path: '/role/:role_id',
	version: '1.0',
}, controller.v1.get);

/**
 * Create Role: POST /role
 */
router.post({
	path: '/role',
	version: '1.0',
}, controller.v1.create);


/**
 * Update Role: PUT /role/{rol_uid}
 */
router.put({
	path: '/role/:role_id',
	version: '1.0',
}, controller.v1.update);


/**
 * Delete Role: DELETE /role/{rol_uid}
 */
router.del({
	path: '/role/:role_id',
	version: '1.0',
}, controller.v1.delete);


/**
 * Get Users with Role: GET /role/{rol_uid}/users
 */
router.get({
	path: '/role/:role_id/users',
	version: '1.0',
}, controller.v1.users);


/**
 * Available Users for Role: GET /role/{rol_uid}/available-users
 * coming soon
 */

/**
 * Assign User to Role: POST /role/{rol_uid}/user
 */
router.post({
	path: '/role/:role_id/user',
	version: '1.0',
}, controller.v1.addUser);


/**
 * Unassign User from Role: DELETE /role/{rol_uid}/user/{usr_uid}
 */
router.del({
	path: '/role/:role_id/user',
	version: '1.0',
}, controller.v1.deleteUser);

/**
 * Permissions List for Role: GET /role/{rol_uid}/permissions
 */
router.get({
	path: '/role/:role_id/permissions',
	version: '1.0',
}, controller.v1.permissions);


/**
 * Available Permissions for Role: GET /role/{rol_uid}/available-permissions
 * coming soon
 */


/**
 * Assign Permission to Role: POST /role/{rol_uid}/permission
 */
router.post({
	path: '/role/:role_id/permission',
	version: '1.0',
}, controller.v1.assignPermission);


/**
 * Unassign Permission from Role: DELETE /role/{rol_uid}/permission/{per_uid}
 */
router.del({
	path: '/role/:role_id/permission',
	version: '1.0',
}, controller.v1.revokePermission);

module.exports = router;