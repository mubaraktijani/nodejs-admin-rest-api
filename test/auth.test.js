'use strict';

process.env.NODE_ENV = 'test';

const app = require('../index');
const expect = require('chai').expect;
const request = require('supertest')(app);

const User = require('../app/models/User');

const params = {
    name: 'Mubarak Asafa',
    username: 'barak1.tj',
    email: 'starclick192@gmail.com',
    password: '123456',
};

describe('User Authentication API Integration Tests', function () {

    let auth = {};

    describe('#POST /auth/signup', function () {
        it('User registration Should return 201 and confirmation for valid input', function (done) {
            request
                .post('/api/v1/auth/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(params)
                .expect(200)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equal('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#POST /auth/resend', function () {
        it('Resend user registration Should return 200 and send confirmation token', function (done) {
            request
                .post('/api/v1/auth/resend')
                .field('email', params.email)
                .expect(200)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equal('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#POST /auth/confirmation/:token', function () {
        it('User confirmation Should return 200 if valid token and 404 if not valid', function (done) {
            User.token(params.email).then(user => {
                const token = (user && user.toJSON().token) ? user.toJSON().token.token : null;
                request
                    .post('/api/v1/auth/confirmation/' + token)
                    .field('email', params.email)
                    .expect(200)
                    .then(res => {
                        expect(res.body).haveOwnProperty('status').equal('success');
                        done();
                    }).catch(err => done(err));
            }).catch(err => done(err));
        });
    });

    describe('#POST /auth/login', function () {
        it('User login should return 200 and token for valid credentials', loginUser(auth));
    });

    describe('#POST /auth/forgot', function () {
        it('User forgot password Should return 200', function (done) {
            request
                .post('/api/v1/auth/forgot')
                .field('email', params.email)
                .expect(200)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equal('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#POST /auth/reset/:token', function () {
        it('Testing change user password', function (done) {
            User.passwordReset(params.email).then(user => {
                const token = (user && user.toJSON().passwordReset) ?
                    user.toJSON().passwordReset.token : null;
                request
                    .post('/api/v1/auth/reset/' + token)
                    .field('password', params.password)
                    .expect(200)
                    .then(res => {
                        expect(res.body).haveOwnProperty('status').equal('success');
                        done();
                    }).catch(err => done(err));
            }).catch(err => done(err));
        });
    });

});

function loginUser(auth) {
    return function (done) {
        request
            .post('/api/v1/auth/login')
            .field('username', 'admin')
            .field('password', '123456')
            .expect(200)
            .then(res => onResponse(res))
            .catch(err => done(err));

        function onResponse(res) {
            expect(res.body).haveOwnProperty('data');
            expect(res.body).haveOwnProperty('token');

            auth.id = res.body.data.id;
            auth.email = res.body.data.email;
            auth.token = res.body.token;

            done();
        }
    };
}

module.exports.loginUser = loginUser;