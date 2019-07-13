'use strict';

let router = new(require('restify-router')).Router();
const controller = require('../controller/permission');

/**
 * Get Permission List: GET /roles
 */
router.get({
	path: '/permissions',
	version: '1.0',
}, controller.v1.get);


/**
 * Get Role Information: GET /role/{rol_uid}
 * coming soon
 */
router.get({
	path: '/permission/:perm_id',
	version: '1.0',
}, controller.v1.get);

/**
 * Create Permission: POST /role
 */
router.post({
	path: '/permission',
	version: '1.0',
}, controller.v1.create);


/**
 * Update Permission: PUT /role/{rol_uid}
 */
router.put({
	path: '/permission/:perm_id',
	version: '1.0',
}, controller.v1.update);


/**
 * Delete Permission: DELETE /role/{rol_uid}
 */
router.del({
	path: '/permission/:perm_id',
	version: '1.0',
}, controller.v1.delete);


module.exports = router;