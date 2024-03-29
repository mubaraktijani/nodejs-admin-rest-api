const httpErr = require('restify-errors');
const Role = app.models.Role;
const Permission = app.models.Permission;
const UserRole = app.models.UserRole;
const RolePermission = app.models.RolePermission;
const Validator = require('./validator');

module.exports = {

    get: (req, res) => {
        const role_id = req.params.role_id;
        if (role_id) {
            return Role.where({
                    id: role_id
                })
                .fetch({
                    withRelated: ['users', 'permissions']
                })
                .then(role => {
                    if (!role) return res.json(new httpErr.NotFoundError('Role Not Found!'));

                    res.json(role);
                })
                .catch(err => {
                    Log.error(err);
                    res.json(new httpErr.InternalServerError("Couldn't get Role Users. Please try again!"));
                });
        }
        return Role.fetchAll().then(roles => {
            res.json(roles.toJSON());
        });
    },

    create: (req, res) => {
        Validator.create.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

            const {
                name,
                desc,
                status
            } = params;
            const code = (!params.code) ? name.split(' ').join('_') : params.code;

            Role.where('name', name).fetch().then((data) => {
                if (data) return res.json(data);

                return Role.save({
                    code: code,
                    name: name,
                    description: desc,
                    status: status
                }).then((role) => {
                    res.json(role);
                });

            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't create Role. Please try again!"));
            });
        });
    },

    update: (req, res) => {
        Validator.update.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

            const {
                role_id,
                name,
                desc,
                status
            } = params;
            const code = (!params.code) ? name.split(' ').join('_') : params.code;

            Role.where({
                id: role_id
            }).fetch().then(role => {
                if (!role) return res.json(new httpErr.NotFoundError('Role Not Found!'));

                role.set('code', code);
                role.set('name', name);
                role.set('description', desc);
                role.set('status', status);

                return role.save().then(role => {
                res.json(role);
            });
            }).catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't update Role. Please try again!"));
            });

        });
    },

    delete: (req, res) => {
        const role_id = req.params.role_id;
        Role.where('id', role_id).fetch().then(role => {
            if (!role) return res.json(new httpErr.NotFoundError('Role Not Found!'));

            // Delete all assigned permissions before deleting role
            return RolePermission.where('role_id', role_id).fetchAll().then(role_perms => {
                role_perms.each(role_perm => role_perm.destroy());
                return role.destroy().then(() => {
            res.json('Role Deleted');
        });
            });
        }).catch((err) => {
            Log.error(err);
            res.json(new httpErr.InternalServerError("Couldn't delete Role. Please try again!"));
        });
    },

    users: (req, res) => {
        Role.where('id', req.params.role_id).fetch({
                withRelated: ['users']
            })
            .then(role => {
                if (!role) return res.json(new httpErr.NotFoundError('Role Not Found!'));

                role = role.toJSON();

                if (!role.users.length)
                    return res.json('Role does\'t have any User!');

                res.json(role.users);
            })
            .catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't get Role Users. Please try again!"));
            });
    },

    addUser: (req, res) => {
        Validator.addUser.validate(req.params, (err, params) => {
            if (err)
                return res.json(new httpErr.BadRequestError(err.details[0].message));

            const {
                role_id,
                user_id
            } = params;

            Role.where({
                    id: role_id
                }).fetch().then(role => {
                    if (!role)
                        return res.json(new httpErr.NotFoundError('Role Not Found!'));

                    return UserRole.where({
                        user_id: user_id
                    }).fetch().then(user_role => {
                        if (user_role) {
                            return UserRole.forge({
                                user_id: user_id,
                                role_id: role.id,
                                status: 1
                            }).save().then(() => res.json('New User is Assign a Role'));
                        }
                        
                        return UserRole.forge({
                            role_id: role.id,
                            user_id: user_id
                        }).save(null, {
                            method: 'insert'
                        }).then(() => res.json('New User is Assign a Role'));
                    });

                })
                .catch((err) => {
                    Log.error(err);
                    res.json(new httpErr.InternalServerError("Couldn't add Role User. Please try again!"));
                });
        });
    },

    deleteUser: (req, res) => {
        Validator.addUser.validate(req.params, (err, params) => {
            if (err)
                return res.json(new httpErr.BadRequestError(err.details[0].message));

            const {
                role_id,
                user_id
            } = params;

            Role.where('id', role_id).fetch().then(role => {
                    if (!role)
                        return res.json(new httpErr.NotFoundError('Role Not Found!'));

                    return UserRole.where('user_id', user_id).fetch().then(user_role => {
                            if (user_role) {
                                return UserRole.where('user_id', user_id)
                                    .save({
                                        'role_id': role.id,
                                        status: '0'
                                    }, {
                                        method: 'update',
                                        patch: true
                                    });
                            }
                        })
                        .then(() => {
                            res.json('User Unassign from the Role');
                        });
                })
                .catch((err) => {
                    Log.error(err);
                    res.json(new httpErr.InternalServerError("Couldn't update Role. Please try again!"));
                });
        });
    },

    permissions: (req, res) => {
        Role.where({
                id: req.params.role_id
            })
            .fetch({
                withRelated: ['permissions']
            })
            .then(role => {
                if (!role) return res.json(new httpErr.NotFoundError('Role Not Found!'));

                role = role.toJSON();

                if (!role.permissions.length)
                    return res.json('Role does\'t have any Permission!');

                res.json(role.permissions);
            })
            .catch((err) => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't get Role Permissions. Please try again!"));
            });
    },

    assignPermission: (req, res) => {
        Validator.assignPermission.validate(req.params, (err, params) => {
            if (err)
                return res.json(new httpErr.BadRequestError(err.details[0].message));

            const {
                role_id,
                perm_id
            } = params;

            Role.where({
                    id: role_id
                }).fetch({
                    withRelated: ['permissions']
                }).then(role => {
                    if (!role)
                        return res.json(new httpErr.NotFoundError('Role Not Found!'));

                    return Permission.where({
                        id: perm_id
                    }).fetch().then(perm => {

                        if (!perm)
                            return res.json(new httpErr.NotFoundError('Permission Not Found!'));

                        role = role.toJSON();
                        perm = perm.toJSON();
                        perm_exists = false;

                        role.permissions.forEach(role_perm => {
                            if (role_perm.id == perm_id) {
                                perm_exists = true;
                                return;
                            }
                        });

                        if (!perm_exists) {
                            return new RolePermission({
                                role_id: role_id,
                                permission_id: perm_id
                            }).save(null, {
                                method: 'insert'
                            }).then(rolePerm => {
                                res.json(perm.name + ' Permission Assign to ' + role.name + ' Role');
                            });
                        } else {
                            res.json(perm.name + ' Permission Already Assigned');
                        }

                    });
                })
                .catch((err) => {
                    Log.error(err);
                    res.json(new httpErr.InternalServerError("Couldn't update Role. Please try again!"));
                });
        });
    },

    revokePermission: (req, res) => {
        Validator.assignPermission.validate(req.params, (err, params) => {
            if (err)
                return res.json(new httpErr.BadRequestError(err.details[0].message));

            RolePermission.where({
                    role_id: params.role_id,
                    permission_id: params.perm_id
                })
                .fetch()
                .then(role_perm => {
                    if (!role_perm)
                        return res.json('Role Permission Not Assigned!');

                    return role_perm.destroy().then(() => {
                        res.json('Role Permission Unassign!');
                    });
                })
                .catch((err) => {
                    Log.error(err);
                    res.json(new httpErr.InternalServerError("Couldn't create Role. Please try again!"));
                });
        });
    },
};