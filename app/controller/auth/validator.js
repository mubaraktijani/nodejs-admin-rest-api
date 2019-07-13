var Joi = require('joi');

module.exports = {

	login: Joi.object().keys({
		username: Joi.string().min(3).max(30).required(),
		password: Joi.string().min(6).required(),
	}),

	loginByEmail: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	}),

	signup: Joi.object().keys({
		name: Joi.string().min(3).max(30).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	})

};