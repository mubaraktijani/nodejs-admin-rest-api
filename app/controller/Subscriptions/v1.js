'use_strict';

const httpErr = require('restify-errors');
const Validator = require('./validator');
const Subscription = app.models.Subscription;
const SubscriptionMeta = app.models.SubscriptionMeta;

exports.get = (req, res) => {
    const path = req.getRoute().path.split('/');
    const enabled = (path[path.length - 1] === 'disabled') ? false : true;
    const subscription_id = req.params.subscription_id;

    const msg = (enabled) ? 'No Subscription has been Created or Enabled.' : 'No Subscription has been Disabled!';

    if (subscription_id)
        return Subscription.where('id', subscription_id)
            .fetch({
                withRelated: ['meta', 'users']
            })
            .then(subscription => {
                if (!subscription.length)
                    return res.json(new httpErr.NotFoundError('Subscription not Found.'));
                res.json(subscription);
            })
            .catch(err => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't get Subscription. Please try again!"));
            });

    Subscription.where('enabled', enabled).fetchAll({
            required: true,
            withRelated: ['meta']
        })
        .then(subscriptions => {
            if (!subscriptions.length) return res.json(msg);
            res.json(subscriptions);
        })
        .catch(err => {
            Log.error(err);
            res.json(new httpErr.InternalServerError("Couldn't get Subscriptions. Please try again!"));
        });
};

exports.create = (req, res) => {
    Validator.create.validate(req.params, (err, params) => {
        if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

        const {
            name,
            desc,
            price,
            free_trail_days,
            month
        } = params;

        Subscription.where('name', params.name)
            .fetch()
            .then(subscription => {
                if (subscription) return res.json(subscription);

                return Subscription
                    .forge({
                        name: name,
                        description: desc,
                        price: price,
                        free_trail_days: free_trail_days,
                        month: month
                    })
                    .save()
                    .then(subscription => {
                        res.json(subscription);
                    });
            })
            .catch(err => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't Create new Subscription. Please try again!"));
            });
    });
};

exports.update = (req, res) => {
    Validator.update.validate(req.params, (err, params) => {
        if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

        const {
            subscription_id,
            name,
            desc,
            price,
            free_trail_days,
            month
        } = params;

        Subscription.where('id', subscription_id)
            .fetch()
            .then(subscription => {
                if (!subscription) return res.json(new httpErr.NotFoundError('Subscription Not Found'));
                
                if (subscription.toJSON().name !== name) subscription.set('name', name);
                subscription.set('description', desc);
                subscription.set('price', price);
                subscription.set('free_trail_days', free_trail_days);
                subscription.set('month', month);

                return subscription.save()
                    .then(subscription => {
                        res.json(subscription);
                    });
            })
            .catch(err => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't Update Subscription. Please try again!"));
            });
    });
};

exports.delete = (req, res) => {
    const id = req.params.subscription_id;

    Subscription.where('id', id)
        .fetch()
        .then(subscription => {
            if (!subscription) return res.json(new httpErr.NotFoundError('Subscription Not Found'));

            return subscription.destroy()
                .then(() => {
                    res.json('Subscription Deleted');
                });
        })
        .catch(err => {
            Log.error(err);
            res.json(new httpErr.InternalServerError("Couldn't Delete Subscription. Please try again!"));
        });
};

exports.enable = (req, res) => {
    const id = req.params.subscription_id;

    Subscription.where('id', id)
        .fetch()
        .then(subscription => {
            if (!subscription) return res.json(new httpErr.NotFoundError('Subscription Not Found'));

            subscription.set('enabled', true);

            return subscription.save()
                .then(() => {
                    res.json('Subscription Enabled');
                });
        })
        .catch(err => {
            Log.error(err);
            res.json(new httpErr.InternalServerError("Couldn't Enable Subscription. Please try again!"));
        });
};

exports.disable = (req, res) => {
    const id = req.params.subscription_id;

    Subscription.where('id', id)
        .fetch()
        .then(subscription => {
            if (!subscription) return res.json(new httpErr.NotFoundError('Subscription Not Found'));

            subscription.set('enabled', false);

            return subscription.save()
                .then(() => {
                    res.json('Subscription Disabled');
                });
        })
        .catch(err => {
            Log.error(err);
            res.json(new httpErr.InternalServerError("Couldn't Disable Subscription. Please try again!"));
        });
};

exports.createMeta = (req, res) => {
    Validator.createMeta.validate(req.params, (err, params) => {
        if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));
        
        const {
            subscription_id,
            key,
            value
        } = params;

        Subscription.where('id', subscription_id)
            .fetch()
            .then(subscription => {
                if (!subscription) return res.json(new httpErr.NotFoundError('Subscription Not Found'));
    
                return SubscriptionMeta.where({
                        'subscription_id': subscription_id,
                        'key': key
                    })
                    .fetch()
                    .then(subscriptionMeta => {
                        if (subscriptionMeta) return res.json('Subscription Meta Already Exists');

                        return SubscriptionMeta.forge({
                                subscription_id: subscription_id,
                                key: key,
                                value: value
                            })
                            .save()
                            .then(() => res.json('Subscription Meta created successfully'));
                    });
            })
            .catch(err => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't create a Subscription Meta. Please try again!"));
            });
    });

};

exports.updateMeta = (req, res) => {
    Validator.updateMeta.validate(req.params, (err, params) => {
        if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));

        const {
            subscription_id,
            meta_id,
            value
        } = params;

        Subscription.where('id', subscription_id)
            .fetch()
            .then(subscription => {
                if (!subscription) return res.json(new httpErr.NotFoundError('Subscription Not Found'));

                return SubscriptionMeta.where('id', meta_id).fetch()
                    .then(subscriptionMeta => {
                        if (!subscriptionMeta) return res.json(new httpErr.NotFoundError('Subscription Meta Not Found'));

                        subscriptionMeta.set('value', value);

                        return subscriptionMeta.save()
                            .then(() => res.json('Subscription Meta updated successfully'));
                    });
            })
            .catch(err => {
                Log.error(err);
                res.json(new httpErr.InternalServerError("Couldn't Update Subscription Meta. Please try again!"));
            });
    });
};

exports.deleteMeta = (req, res) => {
    const {
        subscription_id,
        meta_id
    } = req.params;

    Subscription.where('id', subscription_id)
        .fetch()
        .then(subscription => {
            if (!subscription) return res.json(new httpErr.NotFoundError('Subscription Not Found'));

            return SubscriptionMeta.where('id', meta_id).fetch()
                .then(subscriptionMeta => {
                    if (!subscriptionMeta) return res.json(new httpErr.NotFoundError('Subscription Meta Not Found'));

                    return subscriptionMeta.destroy()
                        .then(() => res.json('Subscription Meta Deleted successfully'));
                });
        })
        .catch(err => {
            Log.error(err);
            res.json(new httpErr.InternalServerError("Couldn't Delete Subscription Meta. Please try again!"));
        });
};