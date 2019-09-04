'use strict';

module.exports = Auth.authorize({
    // Use this parameter for binding the library methods to a specified
    // object, instead of the req object itself. For example on passport.js
    // default implementation, the user information is stored in the 'user'
    // property, as specified on this particular example.
    bindToProperty: 'user'
}, function (req, done) {
    // Get your users roles and/ orpermissions.
    let auth = {
        roles: [],
        permissions: []
    };

    if (req.auth && req.auth.role)
        return app.models.Role
            .where('id', req.auth.role.id)
            .fetch({
                withRelated: ['permissions']
            })
            .then(role => {
                if (!role) return done(false);

                role = role.toJSON();

                role.permissions.forEach(perm => {
                    auth.permissions.push(perm.code);
                });
                //console.log(auth.permissions);

                auth.roles.push(role.code);

                done(auth);
            });

    done(auth);
});