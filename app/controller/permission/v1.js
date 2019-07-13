const httpErr = require('restify-errors');
const Permission = require('../../models/permission.model');
const Validator = require('./validator');

module.exports = {
    
    get: (req, res) => {
        Permission.fetchAll().then(perms => {
            res.json(perms);
        });
    },

    create: (req, res) => {
        Validator.create.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

            const {code, name, desc} = params;

            Permission.where('name', name).fetch().then((data) => {
                if (data) return res.json('Permission Already exists!');

                return Permission.forge({
                    code: code,
                    name: name,
                    description: desc
                }).save();

            }).then((perm) => {
                res.json(perm);
            }).catch((err) => {
                Log.error(err.message);
                res.json(new httpErr.InternalServerError("Couldn't create Permission. Please try again!"));
            });
        });
    },

    update: (req, res) => {
        Validator.update.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

            const {perm_id, code, name, desc} = params;

            Permission.where({id: perm_id}).fetch().then(perm => {
                if (!perm) return res.json(new httpErr.NotFoundError('Permission does\'t exists!'));

                perm.set('code', code);
                perm.set('name', name);
                perm.set('description', desc);

                return perm.save();
                
            }).then(perm => {
                res.json(perm);
            }).catch((err) => {
                Log.error(err.message);
                res.json(new httpErr.InternalServerError("Couldn't update Permission. Please try again!"));
            });

        });
    },

    delete: (req, res) => {
        Permission.where({id: req.params.perm_id}).fetch().then(perm => {
            if (!perm) return res.json(new httpErr.NotFoundError('Permission does\'t exists!'));
            return perm.destroy();
        }).then(perm => {
            res.json('Permission Deleted');
        }).catch((err) => {
            Log.error(err.message);
            res.json(new httpErr.InternalServerError("Couldn't delete Permission. Please try again!"));
        });
    },

};