'use_strict';

const _ = require('lodash');

class Acl {

    constructor(permissions) {
        //if (typeof permissions !== 'object') throw new TypeError('Expected an object as input');
        this.permissions = permissions;
    }

    hasPermission(permission) {
        console.log(permission);
        return (this.permissions[permission]) ? true : false;
    }

}

module.exports = Acl;