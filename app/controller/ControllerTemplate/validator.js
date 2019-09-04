'use_strict';

var Joi = require('joi');

exports.template = Joi.object().keys({
    controller: Joi.string().min(3).max(30).required(),
});