'use_strict';

const httpErr = require('restify-errors');
const Validator = require('./validator');

exports.get = (req, res) => { };

exports.create = (req, res) => {
    Validator.controller.validate(req.params, (err, params) => {
        if (err) return res.json(new httpErr.BadRequestError(err.details[0].message));
    });
};

exports.update = (req, res) => { };

exports.delete = (req, res) => { };