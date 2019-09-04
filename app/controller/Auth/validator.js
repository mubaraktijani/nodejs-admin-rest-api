var Joi = require('joi');

module.exports = {

	login: Joi.object().keys({
		username: Joi.string().min(3).max(30).required(),
		password: Joi.string().min(6).required(),
	}),

	confirmation: Joi.object().keys({
		email: Joi.string().email().required(),
		token: Joi.string().required(),
	}),

	resend: Joi.object().keys({
		email: Joi.string().email().required()
	}),

	forgotPassword: Joi.object().keys({
		email: Joi.string().email().required()
	}),

	passwordReset: Joi.object().keys({
		token: Joi.string().required(),
		password: Joi.string().min(6).required(),
	}),

	signup: Joi.object().keys({
		name: Joi.string().min(3).max(30).required(),
		username: Joi.string().min(3),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	})

};