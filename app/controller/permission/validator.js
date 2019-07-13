var Joi = require('joi');

module.exports = {

	create: Joi.object().keys({
		code: Joi.string().min(3).max(30).required(),
		name: Joi.string().min(3).max(30).required(),
		desc: Joi.string().min(3),
		status: Joi.number().integer(),
	}),

	update: Joi.object().keys({
		perm_id: Joi.number().integer(),
		code: Joi.string().min(3).max(30).required(),
		name: Joi.string().min(3).max(30).required(),
		desc: Joi.string().min(3),
	}),
};