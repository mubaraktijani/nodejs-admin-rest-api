'use strict';

let Route = new(require('restify-router')).Router();
const v1 = require('./v1');

/**
 * Get Roles List: GET /roles
 */
Route.get({
        path: '/subscriptions',
        version: '1.0',
    },
    v1.get
);

Route.get({
        path: '/subscriptions/disabled',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'read_admin', 'read_subscriptions',
        'create_admin'
    ]),
    v1.get
);

Route.get({
        path: '/subscription/:subscription_id',
        version: '1.0',
    },
    v1.get
);

Route.post({
        path: '/subscription',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_subscriptions',
        'create_admin'
    ]),
    v1.create
);

Route.put({
        path: '/subscription/:subscription_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'update_subscriptions',
        'create_admin'
    ]),
    v1.update
);

Route.del({
        path: '/subscription/:subscription_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'delete_subscriptions',
        'create_admin'
    ]),
    v1.delete
);

Route.post({
        path: '/subscription/:subscription_id/enable',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_subscriptions',
        'update_subscriptions',
        'delete_subscriptions',
        'create_admin'
    ]),
    v1.enable
);

Route.post({
        path: '/subscription/:subscription_id/disable',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'create_subscriptions',
        'update_subscriptions',
        'delete_subscriptions',
        'create_admin'
    ]),
    v1.disable
);

Route.post({
        path: '/subscription/:subscription_id/meta',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'read_subscriptions',
        'create_admin'
    ]),
    v1.createMeta
);

Route.put({
        path: '/subscription/:subscription_id/meta/:meta_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'update_subscriptions',
        'create_admin'
    ]),
    v1.updateMeta
);

Route.del({
        path: '/subscription/:subscription_id/meta/:meta_id',
        version: '1.0',
    },
    Auth.hasAnyPermission([
        'delete_subscriptions',
        'create_admin'
    ]),
    v1.deleteMeta
);

module.exports = Route;