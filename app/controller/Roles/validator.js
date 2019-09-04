var Joi = require('joi');

module.exports = {

	create: Joi.object().keys({
		code: Joi.string().min(3).max(30),
		name: Joi.string().min(3).max(30).required(),
		desc: Joi.string().min(3),
		status: Joi.number().integer(),
	}),

	update: Joi.object().keys({
		role_id: Joi.number().integer(),
		code: Joi.string().min(3).max(30),
		name: Joi.string().min(3).max(30).required(),
		desc: Joi.string().min(3),
		status: Joi.number().integer(),
	}),

	addUser: Joi.object().keys({
		role_id: Joi.number().integer(),
		user_id: Joi.number().integer().required()
	}),

	assignPermission: Joi.object().keys({
		role_id: Joi.number().integer(),
		perm_id: Joi.number().integer().required()
	}),
};