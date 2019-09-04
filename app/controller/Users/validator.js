var Joi = require('joi');

module.exports = {
	create: Joi.object().keys({
		user_id: Joi.number(),
		name: Joi.string().min(3).max(30).required(),
		username: Joi.string().min(3),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
		role_id: Joi.number(),
	}),

	update: Joi.object().keys({
		user_id: Joi.number().required(),
		name: Joi.string().min(3).max(30),
		username: Joi.string().min(3),
		email: Joi.string().email(),
		role_id: Joi.number(),
	}),

	assignRole: Joi.object().keys({
		user_id: Joi.number().required(),
		role_id: Joi.number().required(),
	}),

	userId: Joi.object().keys({
		user_id: Joi.number().required()
	})

};