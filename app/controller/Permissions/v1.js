const httpErr = require('restify-errors');
const Permission = app.models.Permission;
const Validator = require('./validator');

module.exports = {

    get: (req, res) => {
        const perm_id = req.params.perm_id;
        if (perm_id) return Permission.where('id', perm_id).fetch({
                withRelated: ['role']
            }).then(perm => {
                if (!perm) return res.json(new httpErr.NotFoundError('Permission Not Found!'));

                res.json(perm);
            })
            .catch(err => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't get Permission Info. Please try again!"));
            });


        Permission.fetchAll().then(perms => {
            res.json(perms);
        });
    },

    create: (req, res) => {
        Validator.create.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

            const {
                name,
                desc
            } = params;
            const code = (!params.code) ? name.split(' ').join('_') : params.code;

            Permission.where('code', code).fetch().then((data) => {
                if (data) return res.json(data);

                return Permission.save({
                    code: code,
                    name: name,
                    description: desc
                }).then((perm) => {
                    res.json(perm);
                });

            }).catch((err) => {
                Log.error(err.message);
                res.json(new httpErr.InternalServerError("Couldn't create Permission. Please try again!"));
            });
        });
    },

    update: (req, res) => {
        Validator.update.validate(req.params, (err, params) => {
            if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

            const {
                perm_id,
                name,
                desc
            } = params;
            const code = (!params.code) ? name.split(' ').join('_') : params.code;

            Permission.where({
                id: perm_id
            }).fetch().then(perm => {
                if (!perm) return res.json(new httpErr.NotFoundError('Permission does\'t exists!'));

                perm.set('code', code);
                perm.set('name', name);
                perm.set('description', desc);

                return perm.save().then(perm => {
                    res.json(perm);
                });
            }).catch((err) => {
                Log.error(err.message);
                res.json(new httpErr.InternalServerError("Couldn't update Permission. Please try again!"));
            });

        });
    },

    delete: (req, res) => {
        Permission.where({
            id: req.params.perm_id
        }).fetch().then(perm => {
            if (!perm) return res.json(new httpErr.NotFoundError('Permission does\'t exists!'));
            return perm.destroy().then(perm => {
                res.json('Permission Deleted');
            });
        }).catch((err) => {
            Log.error(err.message);
            res.json(new httpErr.InternalServerError("Couldn't delete Permission. Please try again!"));
        });
    },

};