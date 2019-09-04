'use_strict';

var Joi = require('joi');

exports.create = Joi.object().keys({
    name: Joi.string().required(),
    desc: Joi.string(),
    price: Joi.number().required(),
    free_trail_days: Joi.number().default(7),
    month: Joi.number().default(1),
});

exports.update = Joi.object().keys({
    subscription_id: Joi.number().required(),
    name: Joi.string().required(),
    desc: Joi.string(),
    price: Joi.number(),
    free_trail_days: Joi.number().default(7),
    month: Joi.number().default(1),
});

exports.createMeta = Joi.object().keys({
    subscription_id: Joi.number().required(),
    key: Joi.string().required(),
    value: Joi.string().required(),
});

exports.updateMeta = Joi.object().keys({
    subscription_id: Joi.number().required(),
    meta_id: Joi.number().required(),
    value: Joi.string().required(),
});